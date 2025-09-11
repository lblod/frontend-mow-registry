import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import t from 'ember-intl/helpers/t';
import type { LegacyResourceQuery } from '@ember-data/store/types';
import type Icon from 'mow-registry/models/icon';

interface Signature {
  Args: {
    id?: string;
    selected: Icon | null;
    onChange: (icon: Icon) => void;
  };
}

export default class IconSelectComponent extends Component<Signature> {
  @service declare store: Store;
  @tracked icons: Icon[] = [];

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.loadIconCatalogTask
      .perform()
      .then((icons) => {
        this.icons = icons;
      })
      .catch((err) => {
        console.error('Error loading icon catalog', err);
      });
  }

  loadIconCatalogTask = task({ restartable: true }, async (search?: string) => {
    await timeout(300); // debounce

    const query: LegacyResourceQuery<Icon> = {
      sort: 'label',
    };

    if (search?.length) {
      query['filter[label]'] = search;
    }

    const result = await this.store.query<Icon>('icon', query);

    return result.slice();
  });

  <template>
    <PowerSelect
      @allowClear={{true}}
      @searchEnabled={{true}}
      @loadingMessage={{t 'utility.loading'}}
      @noMatchesMessage={{t 'utility.no-result'}}
      @searchMessage={{t 'utility.search-placeholder'}}
      @searchField='label'
      @search={{perform this.loadIconCatalogTask}}
      @options={{this.icons}}
      @selected={{@selected}}
      @onChange={{@onChange}}
      @triggerId={{@id}}
      as |icon|
    >
      {{icon.label}}
    </PowerSelect>
  </template>
}
