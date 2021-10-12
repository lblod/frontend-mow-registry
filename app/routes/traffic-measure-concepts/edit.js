import Route from '@ember/routing/route';

export default class TrafficMeasureConceptsEditRoute extends Route {
  async model(params) {
    const roadMeasure = await this.store.findRecord('road-measure', params.id);
    await roadMeasure.roadMeasureSections;
    return roadMeasure;
  }
}
