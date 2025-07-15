import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import Store from 'mow-registry/services/store';
import { tracked } from '@glimmer/tracking';
import type Icon from 'mow-registry/models/icon';
import { action } from '@ember/object';
import { query } from '@warp-drive/legacy/compat/builders';
import type { LegacyResourceQuery } from '@warp-drive/core/types';

interface Signature {
  Args: {
    selected: Icon | null;
    onChange: (icon: Icon) => void;
  };
}

export default class IconSelectComponent extends Component<Signature> {
  @service declare store: Store;
  @tracked icons?: Icon[];

  @action
  async didInsert() {
    this.icons = await this.loadIconCatalogTask.perform();
  }

  loadIconCatalogTask = task({ restartable: true }, async (search?: string) => {
    await timeout(300); // debounce

    const queryParams: LegacyResourceQuery<Icon> = {
      sort: 'label',
    };

    if (search?.length) {
      queryParams['filter[label]'] = search;
    }

    const result = (await this.store.request(query<Icon>('icon', queryParams)))
      .content;

    return result.slice();
  });
}
