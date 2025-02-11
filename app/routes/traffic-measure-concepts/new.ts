import Store from '@ember-data/store';
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
    // @ts-expect-error setting belongsTo relationships like this is valid, but TS doesn't like it (yet).
    trafficMeasureConcept.template = template;

    return trafficMeasureConcept;
  }
}
