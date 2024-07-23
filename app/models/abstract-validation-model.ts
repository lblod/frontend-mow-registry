import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import Model from '@ember-data/model';
import Joi, { ObjectSchema, ValidationError, ValidationErrorItem } from 'joi';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import { ModelSchema } from 'ember-data';

interface ValidationErrorDetails {
  [key: string]: ValidationErrorItem;
}
/**
 * Ember Data Model with Joi-based Validation
 */
export default class AbstractValidationModel extends Model {
  @tracked _validationError?: ValidationErrorDetails;

  /**
   * Get the validation schema for the model. Should be overridden in subclasses.
   */
  get validationSchema(): ObjectSchema {
    throw new Error('validationSchema should be overridden');
  }

  /**
   * Get the validation error for the model.
   */
  get error() {
    return this._validationError;
  }

  /**
   * Validate the model using the validation schema.
   */
  async validate(options: object = {}): Promise<boolean> {
    this.#resetValidationErrors();
    const serializedModel = this.#serializeModel();

    try {
      await this.validationSchema.validateAsync(serializedModel, {
        abortEarly: false,
        context: {
          changedAttributes: this.changedAttributes(),
          ...options,
        },
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        this._validationError = this.#mapValidationError(error);
      }

      return false;
    }

    return true;
  }

  /**
   * Validate a single property of the model. Useful for form validation.
   */
  async validateProperty(
    propertyName: string,
    options: object = {},
  ): Promise<boolean> {
    this.#removeValidationError(propertyName);
    const serializedModel = this.#serializeModel();

    try {
      const propertyRule = this.validationSchema.extract([propertyName]);
      const partialSchema = Joi.object({ [propertyName]: propertyRule });
      await partialSchema.validateAsync(serializedModel, {
        abortEarly: false,
        allowUnknown: true,
        context: {
          changedAttributes: this.changedAttributes(),
          ...options,
        },
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        this._validationError = {
          ...this._validationError,
          ...this.#mapValidationError(error),
        };
      }

      return false;
    }

    return true;
  }

  #serializeModelWithDepthControl(
    model: Model | null,
    maxDepth = 2,
  ): { [key: string]: unknown } | undefined {
    if (!model || maxDepth < 0) {
      return undefined;
    }
    const modelSchema = model.constructor as unknown as ModelSchema;
    const fields = [...modelSchema.fields, ['id', 'attribute']] as [
      keyof Model,
      'belongsTo' | 'hasMany' | 'attribute',
    ][];
    const entries = fields.map(([key, type]) => {
      if (type === 'attribute') {
        return [key, model[key]];
      } else if (type === 'belongsTo') {
        // @ts-expect-error TS type in ember-data is not correct
        const belongsTo = model.belongsTo(key).value();
        return [
          key,
          this.#serializeModelWithDepthControl(belongsTo, maxDepth - 1),
        ];
      } else if (type === 'hasMany') {
        // @ts-expect-error TS type in ember-data is not correct
        const hasMany = model.hasMany(key).value();
        if (!hasMany?.length) return [key, undefined];
        const values = hasMany.map((item) => {
          // hasMany is typed DS.ManyArray<any>
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          return '' + item;
        });
        return [key, values];
      } else {
        assert(`Unknown field type: ${type as string}`);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Object.fromEntries(entries);
  }

  #serializeModel() {
    const serializedModel = this.#serializeModelWithDepthControl(this);
    // Remove id on the top level, as it is not part of the validation schema
    if (serializedModel) delete serializedModel.id;

    return serializedModel;
  }

  #mapValidationError(error: ValidationError) {
    return error.details?.reduce((acc, err) => {
      if (err?.context?.key) {
        acc[err.context.key] = err;
      }
      return acc;
    }, {} as ValidationErrorDetails);
  }

  #removeValidationError(key: string) {
    if (this._validationError && key in this._validationError) {
      // delete on copy and reassign to trigger tracking
      let newValidationError = { ...this._validationError };
      delete newValidationError[key];

      this._validationError =
        Object.keys(newValidationError).length === 0
          ? undefined
          : newValidationError;
    }
  }

  /**
   * Reset the model to its original state.
   * @see https://guides.emberjs.com/release/models/#toc_rolling-back-attributes
   */
  reset() {
    this.#resetValidationErrors();
    this.rollbackAttributes();
  }

  #resetValidationErrors() {
    this._validationError = undefined;
  }
}
