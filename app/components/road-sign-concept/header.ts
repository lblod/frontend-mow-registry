import Component from '@glimmer/component';
import type RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import { service } from '@ember/service';

export default class RoadSignConceptHeader extends Component {
  @service declare router: RouterService;
  @tracked isDeleteConfirmationOpen = false;

  removeRoadSignConcept = task(
    async (roadSignConcept: RoadSignConcept, event: InputEvent) => {
      event.preventDefault();
      await Promise.all(
        (await roadSignConcept.shapes).map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await dimension.destroyRecord();
            }),
          );
          await shape.destroyRecord();
        }),
      );
      await roadSignConcept.destroyRecord();
      await this.router.transitionTo('road-sign-concepts');
    },
  );
}
