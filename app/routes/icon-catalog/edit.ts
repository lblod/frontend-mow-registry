import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import IconCatalogEditController from 'mow-registry/controllers/icon-catalog/edit';
import type Icon from 'mow-registry/models/icon';

type Params = {
  id: string;
};
export default class IconCatalogEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      icon: await this.store.findRecord<Icon>('icon', params.id),
    };
  }

  resetController(controller: IconCatalogEditController) {
    controller.reset();
  }
}
