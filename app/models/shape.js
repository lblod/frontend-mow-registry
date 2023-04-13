import Model, { belongsTo } from '@ember-data/model';

export default class ShapeModel extends Model {
  @belongsTo('resource', { inverse: null, async: true, polyMorphic: true })
  targetClass;
  @belongsTo('resource', { inverse: null, async: true, polyMorphic: true })
  targetNode;
  @belongsTo('concept', { inverse: null, async: true }) targetHasConcept;
}
