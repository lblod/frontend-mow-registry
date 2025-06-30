import Component from '@glimmer/component';
import type RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';

interface Signature {
  Args: {
    trafficLightConcept: TrafficLightConcept;
  };
  Element: HTMLElement;
}

export default class TrafficLightConceptHeader extends Component<Signature> {
  @service declare router: RouterService;
  @tracked isDeleteConfirmationOpen = false;

  removeRoadMarkingConcept = task(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.trafficLightConcept.destroyWithRelations();
    this.router.transitionTo('traffic-light-concepts');
  });
}
