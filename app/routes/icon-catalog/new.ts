import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type Icon from 'mow-registry/models/icon';

export default class IconCatalogNewRoute extends Route {
  @service declare store: Store;

  model() {
    return {
      newIcon: this.store.createRecord<Icon>('icon', {}),
    };
  }
}
