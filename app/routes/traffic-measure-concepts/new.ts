import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrafficMeasureConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    const template = this.store.createRecord('template');
    const trafficMeasureConcept = this.store.createRecord(
      'traffic-measure-concept',
    );

    template.value = '';
    // @ts-expect-error setting belongsTo relationships like this is valid, but TS doesn't like it (yet).
    trafficMeasureConcept.template = template;

    return trafficMeasureConcept;
  }
}
