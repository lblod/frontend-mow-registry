import AccountModel from 'mow-registry/models/account';
import CanBeCombinedWithRelationModel from 'mow-registry/models/can-be-combined-with-relation';
import CodeListModel from 'mow-registry/models/code-list';
import ConceptModel from 'mow-registry/models/concept';
import ConceptScheme from 'mow-registry/models/concept-scheme';
import FileModel from 'mow-registry/models/file';
import GroupModel from 'mow-registry/models/group';
import MappingModel from 'mow-registry/models/mapping';
import MustUseRelationModel from 'mow-registry/models/must-use-relation';
import NodeShapeModel from 'mow-registry/models/node-shape';
import PropertyShapeModel from 'mow-registry/models/property-shape';
import RelationModel from 'mow-registry/models/relation';
import ResourceModel from 'mow-registry/models/resource';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import RoadMarkingConceptStatusModel from 'mow-registry/models/road-marking-concept-status';
import RoadMarkingConceptStatusCodeModel from 'mow-registry/models/road-marking-concept-status-code';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignConceptStatusModel from 'mow-registry/models/road-sign-concept-status';
import RoadSignConceptStatusCodeModel from 'mow-registry/models/road-sign-concept-status-code';
import ShapeModel from 'mow-registry/models/shape';
import SkosConcept from 'mow-registry/models/skos-concept';
import TemplateModel from 'mow-registry/models/template';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import TrafficLightConceptStatusModel from 'mow-registry/models/traffic-light-concept-status';
import TrafficLightConceptStatusCodeModel from 'mow-registry/models/traffic-light-concept-status-code';
import TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';
import UserModel from 'mow-registry/models/user';

/**
 * Catch-all for ember-data.
 */
export default interface ModelRegistry {
  account: AccountModel;
  'can-be-combined-with-relation': CanBeCombinedWithRelationModel;
  'code-list': CodeListModel;
  concept: ConceptModel;
  'concept-scheme': ConceptScheme;
  file: FileModel;
  group: GroupModel;
  mapping: MappingModel;
  'must-use-relation': MustUseRelationModel;
  'node-shape': NodeShapeModel;
  'property-shape': PropertyShapeModel;
  relation: RelationModel;
  resource: ResourceModel;
  'road-marking-concept': RoadMarkingConceptModel;
  'road-marking-concept-status': RoadMarkingConceptStatusModel;
  'road-marking-concept-status-code': RoadMarkingConceptStatusCodeModel;
  'road-sign-category': RoadSignCategoryModel;
  'road-sign-concept': RoadSignConceptModel;
  'road-sign-concept-status': RoadSignConceptStatusModel;
  'road-sign-concept-status-code': RoadSignConceptStatusCodeModel;
  shape: ShapeModel;
  'skos-concept': SkosConcept;
  template: TemplateModel;
  'traffic-light-concept': TrafficLightConceptModel;
  'traffic-light-concept-status': TrafficLightConceptStatusModel;
  'traffic-light-concept-status-code': TrafficLightConceptStatusCodeModel;
  'traffic-measure-concept': TrafficMeasureConceptModel;
  user: UserModel;

  [key: string]: any;
}
