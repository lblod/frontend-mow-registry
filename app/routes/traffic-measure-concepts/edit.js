import Route from '@ember/routing/route';

export default class TrafficMeasureConceptsEditRoute extends Route {
  async model(params) {
    const nodeShape = this.store.findRecord('node-shape', params.id);
    return nodeShape;
  }
}
