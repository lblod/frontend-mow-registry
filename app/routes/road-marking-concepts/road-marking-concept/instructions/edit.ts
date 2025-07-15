import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import Store from 'mow-registry/services/store';
import type AncesterRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  instructionId: string;
};

export default class RoadMarkingConceptsRoadMarkingConceptInstructionsEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    const { roadMarkingConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<AncesterRoute>;

    if (params.instructionId === 'new') {
      return {
        roadMarkingConcept,
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
        roadMarkingConcept,
      };
    }
  }
}
