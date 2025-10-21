import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Template from 'mow-registry/models/template';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

export default class TrafficMeasureConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    const template = this.store.createRecord<Template>('template', {});
    const trafficMeasureConcept =
      this.store.createRecord<TrafficMeasureConcept>(
        'traffic-measure-concept',
        {},
      );

    template.value = '';
    trafficMeasureConcept.set('template', template);

    return trafficMeasureConcept;
  }
}
