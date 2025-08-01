import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import Model from '@ember-data/model';
import Joi, {
  type ObjectSchema,
  ValidationError,
  type ValidationErrorItem,
} from 'joi';

type ModelSchema = typeof Model;
type ValidationOptions = {
  warnings?: boolean;
};

type ValidationResult = {
  warning?: ValidationError;
};

export interface CustomValidationErrorItem extends ValidationErrorItem {
  messageArray?: string[];
}

export interface ValidationErrorDetails {
  [key: string]: CustomValidationErrorItem;
}
/**
 * Ember Data Model with Joi-based Validation
 */
export default class AbstractValidationModel extends Model {
  @tracked _validationError?: ValidationErrorDetails;
  @tracked _validationWarning?: ValidationErrorDetails;

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
   * Get the validation warnings for the model.
   */
  get warning() {
    return this._validationWarning;
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
    options: ValidationOptions = {},
  ): Promise<boolean> {
    this.#removeValidationError(propertyName);
    const serializedModel = this.#serializeModel();

    try {
      const propertyRule = this.validationSchema.extract([propertyName]);
      const partialSchema = Joi.object({ [propertyName]: propertyRule });
      const validationResult = (await partialSchema.validateAsync(
        serializedModel,
        {
          abortEarly: false,
          allowUnknown: true,
          warnings: options.warnings,
          context: {
            changedAttributes: this.changedAttributes(),
            ...options,
          },
        },
      )) as ValidationResult;
      if (validationResult.warning) {
        this._validationWarning = this.#mapValidationError(
          validationResult.warning,
        );
      } else {
        this._validationWarning = {};
      }
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
        // @ts-expect-error We can't pass types to .belongsTo since we don't know them. As a result this throws an error, but the code is valid.
        // TODO: I think we can achieve the same with different model methods, which maybe don't have this type issue.
        const belongsTo = model.belongsTo(key).value() as Model | null;
        return [
          key,
          this.#serializeModelWithDepthControl(belongsTo, maxDepth - 1),
        ];
      } else if (type === 'hasMany') {
        // @ts-expect-error We can't pass types to .belongsTo since we don't know them. As a result this throws an error, but the code is valid.
        // TODO: I think we can achieve the same with different model methods, which maybe don't have this type issue.
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
    if (serializedModel) delete serializedModel['id'];

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
      const newValidationError = { ...this._validationError };
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
