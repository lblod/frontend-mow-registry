import Component from '@glimmer/component';
import { service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

export type SignType = {
  label: string;
  modelName:
    | 'road-sign-concept'
    | 'road-marking-concept'
    | 'traffic-light-concept';
  searchFilter: string;
  sortingField: string;
};
export default class TrafficMeasureSelectTypeComponent extends Component {
  @service declare intl: IntlService;

  get types() {
    const types: SignType[] = [
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
}
