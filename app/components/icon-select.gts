import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
// @ts-expect-error need EC v4 to get helper types...
import perform from 'ember-concurrency/helpers/perform';
import Store from 'mow-registry/services/store';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import t from 'ember-intl/helpers/t';
import type Icon from 'mow-registry/models/icon';
import type { LegacyResourceQuery } from '@warp-drive/core/types';

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
    {{! @glint-expect-error need to move to PS 8 }}
    <PowerSelect
      {{! @glint-expect-error need to move to PS 8 }}
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
