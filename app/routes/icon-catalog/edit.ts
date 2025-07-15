import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import IconCatalogEditController from 'mow-registry/controllers/icon-catalog/edit';
import type Icon from 'mow-registry/models/icon';
import { findRecord } from '@warp-drive/legacy/compat/builders';

type Params = {
  id: string;
};
export default class IconCatalogEditRoute extends Route {
  @service declare store: Store;

  async model(params: Params) {
    return {
      icon: await this.store
        .request(findRecord<Icon>('icon', params.id))
        .then((res) => res.content),
    };
  }

  resetController(controller: IconCatalogEditController) {
    controller.reset();
  }
}
