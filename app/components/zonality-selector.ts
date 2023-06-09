import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { ZON_NON_ZONAL_ID, ZON_CONCEPT_SCHEME_ID } from '../utils/constants';
import type Store from '@ember-data/store';
import SkosConcept from 'mow-registry/models/skos-concept';
import ArrayProxy from '@ember/array/proxy';
/**
 * @typedef {Object} Args
 * @property {function} onChange
 * @prop {string} zonality
 */

/**
 * @extends {Component<Args>}
 * @property {Args} args
 */

type Args = {
  zonality: string;
  onChange: (zonality?: SkosConcept) => void;
};
export default class ZonalitySelectorComponent extends Component<Args> {
  @action
  async didInsert() {
    await this.fetchZonalities.perform();
  }

  @tracked zonalities?: ArrayProxy<SkosConcept>;

  @service declare store: Store;

  fetchZonalities = task(async () => {
    const conceptScheme = await this.store.findRecord(
      'concept-scheme',
      ZON_CONCEPT_SCHEME_ID
    );
    this.zonalities = await conceptScheme.concepts;
    if (!this.args.zonality) {
      const defaultZonality = this.zonalities.find(
        (zonality) => zonality.id == ZON_NON_ZONAL_ID
      );
      this.args.onChange(defaultZonality);
    }
  });
}
