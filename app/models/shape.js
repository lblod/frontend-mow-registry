import Model, { belongsTo } from '@ember-data/model';

export default class ShapeModel extends Model {
  @belongsTo('resource') targetClass;
  @belongsTo('resource') targetNode;
  @belongsTo('concept') targetHasConcept;
}
