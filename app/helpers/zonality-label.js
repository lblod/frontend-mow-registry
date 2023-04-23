import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';

export default class ZonalityLabel extends Helper {
  @service intl;
  compute([signConceptOrLabel]) {
    let label;
    if (typeof signConceptOrLabel === 'string') {
      label = signConceptOrLabel;
    } else {
      label = signConceptOrLabel?.zonality?.label;
    }
    if (label) {
      return this.intl.t('utility.' + label);
    } else {
      return this.intl.t('utility.nonZonal');
    }
  }
}
