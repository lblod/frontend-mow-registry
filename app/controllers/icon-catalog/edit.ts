import Controller from '@ember/controller';
import IconCatalogEditRoute from 'mow-registry/routes/icon-catalog/edit';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class IconCatalogEditController extends Controller {
  declare model: ModelFrom<IconCatalogEditRoute>;

  reset() {
    this.model.icon.reset();
  }
}
