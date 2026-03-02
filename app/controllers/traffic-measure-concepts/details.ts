import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import Store from 'mow-registry/services/store';
import type TrafficMeasureConceptsDetailsRoute from 'mow-registry/routes/traffic-measure-concepts/details';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { tracked } from '@glimmer/tracking';

export default class TrafficMeasureConceptsDetailsController extends Controller {
  @service declare router: RouterService;
  @service declare store: Store;
  declare model: ModelFrom<TrafficMeasureConceptsDetailsRoute>;

  @tracked showDeleteConfirmationModal = false;

  delete = task(async () => {
    // We assume a measure only has one template
    const template = await this.model.trafficMeasureConcept.template;
    if (template) {
      (await template.variables).forEach(
        (variable) => void variable.destroyRecord(),
      );
      await template.destroyRecord();
    }
    await this.model.trafficMeasureConcept.destroyRecord();
    this.router.transitionTo('traffic-measure-concepts');
  });
}
