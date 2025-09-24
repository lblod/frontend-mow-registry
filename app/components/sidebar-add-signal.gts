import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn, get } from '@ember/helper';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuBodyContainer from '@appuniversum/ember-appuniversum/components/au-body-container';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import autoFocus from 'mow-registry/modifiers/auto-focus';
import SidebarHeader from './sidebar-header';
import SidebarTrafficSignal from './sidebar-traffic-signal';
import sortByRoadSignCode from 'mow-registry/helpers/sort-by-road-sign-code';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';

type Sig = {
  Args: {
    title: string;
    filterPlaceholder: string;
    addText: string;
    allSignals: TrafficSignalConcept[];
    addSignal: (
      signal:
        | TrafficSignalConcept
        | RoadSignConcept
        | RoadMarkingConcept
        | TrafficLightConcept,
    ) => void;
    onClose: () => void;
  };
  Element: HTMLElement;
};

export default class SidebarAddSignal extends Component<Sig> {
  @tracked filter = '';

  setFilter = (event: Event) => {
    this.filter = (event.target as HTMLInputElement).value;
  };

  get signals() {
    if (!this.filter) {
      return this.args.allSignals;
    }

    return this.args.allSignals.filter((signal) => {
      return signal.meaning?.toLowerCase().includes(this.filter.toLowerCase());
    });
  }

  <template>
    <SidebarHeader @onClose={{@onClose}}>
      <:title>
        {{@title}}
      </:title>
      <:content>
        <div class='au-c-data-table__search'>
          <AuInput
            @icon='search'
            @iconAlignment='right'
            @width='block'
            value={{this.filter}}
            placeholder={{@filterPlaceholder}}
            {{on 'input' this.setFilter}}
            {{autoFocus}}
          />
        </div>
      </:content>
    </SidebarHeader>
    <AuBodyContainer @scroll={{true}}>
      {{#each (sortByRoadSignCode this.signals) as |signal|}}
        <SidebarTrafficSignal
          @imageUrl={{get (get signal.image 'file') 'downloadLink'}}
          @code={{signal.label}}
          @meaning={{signal.meaning}}
          @onAdd={{fn @addSignal signal}}
          @addText={{@addText}}
          class='au-c-action-sidebar__item'
        />
      {{/each}}
    </AuBodyContainer>
  </template>
}
