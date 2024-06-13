import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { ZON_NON_ZONAL_ID } from 'mow-registry/utils/constants';

export default class TrafficMeasureConceptsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    const nonZonalConcept = await this.store.findRecord(
      'skos-concept',
      ZON_NON_ZONAL_ID,
    );
    const template = this.store.createRecord('template');
    const trafficMeasureConcept = this.store.createRecord(
      'traffic-measure-concept',
      {
        zonality: nonZonalConcept,
      },
    );

    template.value = '';
    trafficMeasureConcept.templates.pushObject(template);

    return trafficMeasureConcept;
  }
}
