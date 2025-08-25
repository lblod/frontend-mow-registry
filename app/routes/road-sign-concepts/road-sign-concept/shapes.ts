import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type RoadSignConcept from '../road-sign-concept';
import type Store from 'ember-data/store';
import { service } from '@ember/service';
import type TribontShape from 'mow-registry/models/tribont-shape';

export default class RoadSignConceptsRoadSignConceptMainSignsRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;
    const shapes = await roadSignConcept.shapes;
    let defaultShape = await roadSignConcept.defaultShape;
    if (!defaultShape) {
      defaultShape = this.store.createRecord<TribontShape>('tribont-shape', {});
    }
    return { roadSignConcept, defaultShape, shapes };
  }
}
