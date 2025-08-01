import {
  attr,
  hasMany,
  belongsTo,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import SkosConcept from 'mow-registry/models/skos-concept';
import type Image from 'mow-registry/models/image';
import type Template from './template';
import {
  validateBelongsToOptional,
  validateBelongsToRequired,
  validateBooleanOptional,
  validateHasManyOptional,
  validateStringRequired,
  validateDateOptional,
  validateEndDate,
} from 'mow-registry/validators/schema';
import type TribontShape from './tribont-shape';
import type Variable from './variable';

export default class TrafficSignalConcept extends SkosConcept {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'traffic-signal-concept';

  @attr declare meaning?: string;
  @attr declare valid?: boolean;
  @attr declare arPlichtig?: boolean;
  @attr('date') declare startDate?: Date;
  @attr('date') declare endDate?: Date;

  @hasMany<Variable>('variable', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare variables: AsyncHasMany<Variable>;

  @belongsTo<Image>('image', { async: true, inverse: null, polymorphic: true })
  declare image: AsyncBelongsTo<Image>;

  @belongsTo<SkosConcept>('skos-concept', { async: true, inverse: null })
  declare status: AsyncBelongsTo<SkosConcept>;

  @hasMany<Template>('template', {
    async: true,
    inverse: null,
  })
  declare hasInstructions: AsyncHasMany<Template>;

  @hasMany<TribontShape>('tribont-shape', { inverse: null, async: true })
  declare shapes: AsyncHasMany<TribontShape>;

  @belongsTo<TribontShape>('tribont-shape', { inverse: null, async: true })
  declare defaultShape: AsyncBelongsTo<TribontShape>;

  get validationSchema() {
    return super.validationSchema.keys({
      shapes: validateHasManyOptional(),
      defaultShape: validateBelongsToOptional(),
      valid: validateBooleanOptional(),
      arPlichtig: validateBooleanOptional(),
      startDate: validateDateOptional(),
      endDate: validateEndDate(),
      image: validateBelongsToRequired(),
      meaning: validateStringRequired(),
      status: validateBelongsToOptional(),
      hasInstructions: validateHasManyOptional(),
      variables: validateHasManyOptional(),
    });
  }

  async destroyWithRelations() {
    // This doesn't delete the status or hasTrafficMeasureConcepts relations as it wasn't clear what
    // the expectation would be for these since they don't appear to be used
    const [variables, image, instructions, shapes] = await Promise.all([
      this.variables,
      this.image,
      this.hasInstructions,
      this.shapes,
    ]);

    await Promise.all([
      this.destroyRecord(),
      ...variables.map((variable) => variable.destroyRecord()),
      image?.destroyWithRelations(),
      ...instructions.map((instruction) => instruction.destroyWithRelations()),
      ...shapes.map((shape) => shape.destroyWithRelations()),
    ]);

    return this;
  }
}
