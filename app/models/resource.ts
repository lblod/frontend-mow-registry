import Model, { AsyncHasMany, hasMany } from '@ember-data/model';
import ConceptModel from './concept';

export default class ResourceModel extends Model {
  @hasMany('concept', { inverse: null, async: true })
  declare used: AsyncHasMany<ConceptModel>;
}
