import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import Store from 'mow-registry/services/store';
import type NodeShape from 'mow-registry/models/node-shape';
import type TrafficMeasureConceptsDetailsRoute from 'mow-registry/routes/traffic-measure-concepts/details';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { query } from '@warp-drive/legacy/compat/builders';

export default class TrafficMeasureConceptsDetailsController extends Controller {
  @service declare router: RouterService;
  @service declare store: Store;
  declare model: ModelFrom<TrafficMeasureConceptsDetailsRoute>;

  delete = task(async () => {
    const nodeShapes = (
      await this.store.request(
        query<NodeShape>('node-shape', {
          'filter[targetHasConcept][id]': this.model.trafficMeasureConcept.id,
        }),
      )
    ).content;

    const nodeShape = nodeShapes[0];
    if (nodeShape) {
      await nodeShape.destroyRecord();
    }
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
