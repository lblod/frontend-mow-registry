import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { ZON_NON_ZONAL_ID, ZON_CONCEPT_SCHEME_ID } from '../utils/constants';

export default class ZonalitySelectorComponent extends Component {
  @action
  async didInsert() {
    this.fetchZonalities.perform();
  }

  @tracked zonalities;
  @tracked selectedZonality;

  @service store;

  @task
  *fetchZonalities() {
    yield this.args.concept;
    const conceptScheme = yield this.store.findRecord(
      'concept-scheme',
      ZON_CONCEPT_SCHEME_ID
    );
    this.zonalities = yield conceptScheme.concepts;
    if (yield this.args.concept.zonality) {
      this.selectedZonality = this.args.concept.zonality;
    } else {
      const defaultZonality = this.zonalities.find(
        (zonality) => zonality.id == ZON_NON_ZONAL_ID
      );
      this.updateZonality(defaultZonality);
    }
  }

  @action
  updateZonality(zonality) {
    this.selectedZonality = zonality;
    this.args.concept.zonality = this.selectedZonality;
  }
}
