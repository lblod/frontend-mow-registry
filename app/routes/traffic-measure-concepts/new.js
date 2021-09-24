import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrafficMeasureConceptsNewRoute extends Route {
  @service store;
  
  async model() {
    const roadMeasure=await this.store.createRecord('road-measure');
    const roadMeasureSection=await this.store.createRecord('road-measure-section');
    roadMeasure.roadMeasureSections.pushObject(roadMeasureSection);
    return roadMeasure
  }
}
