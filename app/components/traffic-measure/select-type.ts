import Component from '@glimmer/component';
import { service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

export default class TrafficMeasureSelectTypeComponent extends Component {
  @service declare intl: IntlService;

  get types() {
    const types = [
      {
        label: this.intl.t('road-sign-concept.name'),
        modelName: 'road-sign-concept',
        searchFilter: 'filter[road-sign-concept-code]',
        sortingField: 'road-sign-concept-code',
        labelField: 'roadSignConceptCode',
      },
      {
        label: this.intl.t('road-marking-concept.name'),
        modelName: 'road-marking-concept',
        searchFilter: 'filter[road-marking-concept-code]',
        sortingField: 'road-marking-concept-code',
        labelField: 'roadMarkingConceptCode',
      },
      {
        label: this.intl.t('traffic-light-concept.name'),
        modelName: 'traffic-light-concept',
        searchFilter: 'filter[traffic-light-concept-code]',
        sortingField: 'traffic-light-concept-code',
        labelField: 'trafficLightConceptCode',
      },
    ];
    return types;
  }
}
