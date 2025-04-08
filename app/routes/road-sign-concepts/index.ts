import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import { hash } from 'rsvp';

export default class RoadsignConceptsIndexRoute extends Route {
  @service declare store: Store;

  async model() {
    return hash({
      classifications: this.store.findAll<RoadSignCategory>(
        'road-sign-category',
        {
          reload: true,
        },
      ),
    });
  }
}
