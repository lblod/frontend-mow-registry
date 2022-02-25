import Model, { hasMany } from '@ember-data/model';

export default class ResourceModel extends Model {
  @hasMany('concept', { inverse: null }) used;
}
