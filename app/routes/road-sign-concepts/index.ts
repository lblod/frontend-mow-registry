import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import { hash } from 'rsvp';
import { findAll } from '@warp-drive/legacy/compat/builders';

export default class RoadsignConceptsIndexRoute extends Route {
  @service declare store: Store;

  async model() {
    return hash({
      classifications: this.store
        .request(
          findAll<RoadSignCategory>('road-sign-category', {
            reload: true,
          }),
        )
        .then((res) => res.content),
    });
  }
}
