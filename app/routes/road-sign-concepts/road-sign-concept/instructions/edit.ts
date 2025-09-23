import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import type RoadsignConcept from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  instructionId: string;
};

export default class RoadSignConceptsRoadSignConceptInstructionsEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadsignConcept>;
    const concept = roadSignConcept;
    if (params.instructionId === 'new') {
      return {
        roadSignConcept,
        concept,
      };
    } else {
      const template = await this.store
        .request(
          findRecord<Template>('template', params.instructionId, {
            include: ['variables'],
          }),
        )
        .then((res) => res.content);
      return {
        template,
        roadSignConcept,
        concept,
      };
    }
  }
}
