import Model, { belongsTo } from '@ember-data/model';

export default class ShapeModel extends Model {
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  targetClass;
  @belongsTo('resource', { inverse: null, async: true, polymorphic: true })
  targetNode;
  @belongsTo('concept', { inverse: null, async: true, polymorphic: true })
  targetHasConcept;
}
