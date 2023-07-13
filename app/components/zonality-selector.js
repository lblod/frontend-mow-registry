import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { ZON_NON_ZONAL_ID, ZON_CONCEPT_SCHEME_ID } from '../utils/constants';

/**
 * @typedef {Object} Args
 * @property {function} onChange
 * @prop {string} zonality
 */

/**
 * @extends {Component<Args>}
 * @property {Args} args
 */
export default class ZonalitySelectorComponent extends Component {
  @action
  async didInsert() {
    this.fetchZonalities.perform();
  }

  @tracked zonalities;

  @service store;

  fetchZonalities = task(async () => {
    const conceptScheme = await this.store.findRecord(
      'concept-scheme',
      ZON_CONCEPT_SCHEME_ID,
    );
    this.zonalities = conceptScheme.concepts;
    await this.zonalities;
    if (!this.args.zonality) {
      const defaultZonality = this.zonalities.find(
        (zonality) => zonality.id == ZON_NON_ZONAL_ID,
      );
      this.args.onChange(defaultZonality);
    }
  });
}
