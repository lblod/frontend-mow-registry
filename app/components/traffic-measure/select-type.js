import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrafficMeasureSelectTypeComponent extends Component {
  @service intl;

  get types() {
    const types = [
      {
        label: this.intl.t('roadSignConcept.name'),
        modelName: 'road-sign-concept',
        searchFilter: 'filter[road-sign-concept-code]',
        sortingField: 'road-sign-concept-code',
        labelField: 'roadSignConceptCode',
      },
      {
        label: this.intl.t('roadMarkingConcept.name'),
        modelName: 'road-marking-concept',
        searchFilter: 'filter[road-marking-concept-code]',
        sortingField: 'road-marking-concept-code',
        labelField: 'roadMarkingConceptCode',
      },
      {
        label: this.intl.t('trafficLightConcept.name'),
        modelName: 'traffic-light-concept',
        searchFilter: 'filter[traffic-light-concept-code]',
        sortingField: 'traffic-light-concept-code',
        labelField: 'trafficLightConceptCode',
      },
    ];
    return types;
  }
}
