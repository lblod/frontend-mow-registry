import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import { get } from '@ember/helper';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { getPromiseState } from '@warp-drive/ember';
import t from 'ember-intl/helpers/t';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';

type Sig = {
  Args: {
    sign: TrafficSignalListItem;
    removeSign: (sign: TrafficSignalListItem) => void;
  };
};

export default class InstructionEntry extends Component<Sig> {
  get signalRoute() {
    const signalPromise = getPromiseState(this.args.sign.item);
    if (!signalPromise.isSuccess || !signalPromise.value) {
      return;
    }
    const signal = signalPromise.value;
    if (signal instanceof RoadSignConcept) {
      return 'road-sign-concepts.road-sign-concept';
    }
    if (signal instanceof RoadMarkingConcept) {
      return 'road-marking-concepts.road-marking-concept';
    }
    if (signal instanceof TrafficLightConcept) {
      return 'traffic-light-concepts.traffic-light-concept';
    }
    return;
  }

  <template>
    <tr
      class='au-c-table__row--centered'
      {{sortableItem groupName='signs' model=@sign}}
    >
      <td class='w-px au-u-padding-right-small'>
        <AuButton
          @icon='drag'
          @skin='link'
          @hideText={{true}}
          class='au-c-button--drag'
        >
          {{t 'utility.drag'}}
        </AuButton>
      </td>
      <td>
        <div class='au-o-flex au-o-flex--center'>
          <img
            src={{get (get (get @sign.item 'image') 'file') 'downloadLink'}}
            alt=''
            class='au-c-thumbnail au-c-thumbnail--table'
          />
          <span>
            {{#let (get @sign.item 'label') as |label|}}
              {{#if this.signalRoute}}
                <AuLink @route={{this.signalRoute}} @model={{@sign.item.id}}>
                  {{label}}
                </AuLink>
              {{else}}
                {{label}}
              {{/if}}
            {{/let}}
          </span>
        </div>
      </td>
      <td class='w-px au-u-padding-right-small'>
        <AuButton
          @icon='bin'
          @alert={{true}}
          @skin='secondary'
          @hideText={{true}}
          {{on 'click' (fn @removeSign @sign)}}
        >
          {{t 'utility.delete'}}
        </AuButton>
      </td>
    </tr>
  </template>
}
