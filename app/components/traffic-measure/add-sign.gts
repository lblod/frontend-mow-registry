import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { restartableTask, timeout } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import { query } from '@warp-drive/legacy/compat/builders';
import type { LegacyResourceQuery } from '@warp-drive/core/types';
import t from 'ember-intl/helpers/t';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import Store from 'mow-registry/services/store';
import type { SignalType } from 'mow-registry/components/traffic-measure/select-type';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { isSome, type Option } from 'mow-registry/utils/option';
import TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';

type Sig = {
  Args: {
    selectedType: SignalType;
    selectedValidation?: string | null;
    addSign: (sign: TrafficSignalListItem) => void;
    signs: TrafficSignalListItem[];
    disabled?: boolean;
    allowClear?: boolean;
  };
};

export default class TrafficMeasureAddSignComponent extends Component<Sig> {
  @service declare store: Store;

  @tracked selected?: TrafficSignalConcept | null;

  search = restartableTask(async (searchData: string) => {
    await timeout(300);

    const queryParams: LegacyResourceQuery<
      RoadSignConcept | RoadMarkingConcept | TrafficLightConcept
    > = {};
    queryParams[this.args.selectedType.searchFilter] = searchData;
    queryParams['sort'] = this.args.selectedType.sortingField;
    queryParams['include'] = ['hasInstructions'];

    if (isSome(this.args.selectedValidation)) {
      if (this.args.selectedValidation === 'true') {
        queryParams['filter[valid]'] = true;
      } else {
        queryParams['filter[:or:][:has-no:valid]'] = 'yes';
        queryParams['filter[:or:][valid]'] = false;
      }
    }

    const options = (
      await this.store.request(
        query<
          | RoadSignConcept
          | RoadMarkingConcept
          | TrafficLightConcept
          | TrafficSignalConcept
        >(this.args.selectedType.modelName, queryParams),
      )
    ).content;
    return options;
  });

  @action
  select(selected: TrafficSignalConcept) {
    this.selected = selected;
  }

  @action
  addSign(selected: Option<TrafficSignalConcept>) {
    const signListItem = this.store.createRecord<TrafficSignalListItem>(
      'traffic-signal-list-item',
      {
        position: this.args.signs.length,
        item: selected,
      },
    );
    if (selected) {
      this.args.addSign(signListItem);
      this.selected = null;
    }
  }

  <template>
    <div class='au-o-grid au-o-grid--tiny'>
      <div class='au-o-grid__item au-u-1-2@medium'>
        <PowerSelect
          @loadingMessage={{t 'utility.loading'}}
          @noMatchesMessage={{t 'traffic-measure-concept.crud.no-matches'}}
          @placeholder={{t 'utility.search-placeholder'}}
          @searchEnabled={{true}}
          @searchMessage={{t 'utility.search-placeholder'}}
          @allowClear={{@allowClear}}
          @disabled={{@disabled}}
          @search={{perform this.search}}
          @selected={{this.selected}}
          @onChange={{this.select}}
          as |sign|
        >
          <div class='au-c-thumbnail-holder'>
            <img
              class='au-c-thumbnail au-c-thumbnail--small au-u-margin-right-tiny'
              src={{sign.image.file.downloadLink}}
              loading='lazy'
              alt=''
            />
            {{sign.label}}
          </div>
        </PowerSelect>
      </div>
      <div class='au-o-grid__item au-u-1-2@medium'>
        <AuButton
          @width='block'
          {{on 'click' (fn this.addSign this.selected)}}
          class='au-u-margin-bottom-small'
        >
          {{t 'traffic-measure-concept.attr.add-sign'}}
        </AuButton>
      </div>
    </div>
  </template>
}
