import Component from '@glimmer/component';
import type RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';

interface Signature {
  Args: {
    roadMarkingConcept: RoadMarkingConcept;
  };
  Element: HTMLElement;
}

export default class RoadMarkingConceptHeader extends Component<Signature> {
  @service declare router: RouterService;
  @tracked isDeleteConfirmationOpen = false;

  removeRoadMarkingConcept = task(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.roadMarkingConcept.destroyRecord();
    void this.router.transitionTo('road-marking-concepts');
  });
}
