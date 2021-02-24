import Route from '@ember/routing/route';

export default class RoadSignConceptsSubsignsEditRoute extends Route {
  model(params) {
    return this.store.findRecord('road-sign-concept', params.id, {
      include: 'subSigns',
    });
  }
}
