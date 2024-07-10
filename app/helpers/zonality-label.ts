import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import IntlService from 'ember-intl/services/intl';
import SkosConcept from 'mow-registry/models/skos-concept';

export default class ZonalityLabel extends Helper {
  @service declare intl: IntlService;
  compute([zonality]: [SkosConcept | undefined]) {
    const label = zonality?.get('label');
    if (label) {
      return this.intl.t('utility.' + label);
    } else {
      return this.intl.t('utility.nonZonal');
    }
  }
}
