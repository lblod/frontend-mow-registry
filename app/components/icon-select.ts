import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import IconModel from 'mow-registry/models/icon';
import { action } from '@ember/object';

interface Signature {
  Args: {
    selected: IconModel | null;
    onChange: (icon: IconModel) => void;
  };
}

export default class IconSelectComponent extends Component<Signature> {
  @service declare store: Store;
  @tracked icons?: IconModel[];

  @action
  async didInsert() {
    this.icons = await this.loadIconCatalogTask.perform();
  }

  loadIconCatalogTask = task({ restartable: true }, async (search?: string) => {
    await timeout(300); // debounce

    const query: Record<string, unknown> = {
      sort: 'label',
    };

    if (search?.length) {
      query['filter[label]'] = search;
    }

    const result = await this.store.query('icon', query);

    return result.toArray();
  });
}