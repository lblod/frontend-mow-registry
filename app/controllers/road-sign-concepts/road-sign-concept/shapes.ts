import Controller from '@ember/controller';
import { trackedFunction } from 'reactiveweb/function';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type Owner from '@ember/owner';
import type ShapeClassification from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';
import ShapesRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/shapes';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { DIMENSIONS, type Shape } from 'mow-registry/utils/shapes';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import {
  convertToShape,
  shapeDimensionToText,
  SHAPES,
} from 'mow-registry/utils/shapes';
import type TribontShape from 'mow-registry/models/tribont-shape';
export default class RoadSignConceptsRoadSignConceptShapesController extends Controller {

}
