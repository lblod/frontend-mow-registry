import Component from '@glimmer/component';
import { service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';
import PowerSelect from 'ember-power-select/components/power-select';
import t from 'ember-intl/helpers/t';

export type SignalType = {
  label?: string;
  modelName:
    | 'traffic-signal-concept'
    | 'road-sign-concept'
    | 'road-marking-concept'
    | 'traffic-light-concept';
  searchFilter: string;
  sortingField: string;
};

export const trafficSignalType: SignalType = {
  modelName: 'traffic-signal-concept',
  searchFilter: 'filter[label]',
  sortingField: 'label',
};

type Sig = {
  Args: {
    selectedType: SignalType;
    updateTypeFilter: (signType: SignalType) => void;
  };
};

export default class TrafficMeasureSelectTypeComponent extends Component<Sig> {
  @service declare intl: IntlService;

  get types() {
    const types: SignalType[] = [
      {
        label: this.intl.t('road-sign-concept.name'),
        modelName: 'road-sign-concept',
        searchFilter: 'filter[label]',
        sortingField: 'label',
      },
      {
        label: this.intl.t('road-marking-concept.name'),
        modelName: 'road-marking-concept',
        searchFilter: 'filter[label]',
        sortingField: 'label',
      },
      {
        label: this.intl.t('traffic-light-concept.name'),
        modelName: 'traffic-light-concept',
        searchFilter: 'filter[label]',
        sortingField: 'label',
      },
    ];
    return types;
  }

  get selectedType() {
    return this.args.selectedType.label ? this.args.selectedType : null;
  }

  <template>
    <PowerSelect
      @options={{this.types}}
      @selected={{this.selectedType}}
      @placeholder={{t 'traffic-measure-concept.crud.type-filter'}}
      @onChange={{@updateTypeFilter}}
      @triggerClass='measure-classification-select'
      as |type|
    >
      {{type.label}}
    </PowerSelect>
  </template>
}
