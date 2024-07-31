import {
  hasMany,
  belongsTo,
  attr,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import ConceptScheme from 'mow-registry/models/concept-scheme';
import type VariableModel from 'mow-registry/models/variable';
import type SkosConcept from 'mow-registry/models/skos-concept';
import {
  validateBelongsToOptional,
  validateHasManyOptional,
  validateStringOptional,
  validateStringRequired,
} from 'mow-registry/validators/schema';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'code-list': CodeListModel;
  }
}

export default class CodeListModel extends ConceptScheme {
  @attr declare uri?: string;
  @hasMany('variable', { inverse: 'codeList', async: true })
  declare variables: AsyncHasMany<VariableModel>;
  @belongsTo('skos-concept', { inverse: null, async: true })
  declare type: AsyncBelongsTo<SkosConcept>;

  get validationSchema() {
    return super.validationSchema.keys({
      uri: validateStringOptional(),
      label: validateStringRequired('errors.label.required'),
      variables: validateHasManyOptional(),
      type: validateBelongsToOptional(),
    });
  }
}
