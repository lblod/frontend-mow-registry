import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { ZON_NON_ZONAL_ID, ZON_CONCEPT_SCHEME_ID } from '../utils/constants';
import type Store from '@ember-data/store';
import SkosConcept from 'mow-registry/models/skos-concept';
import { trackedFunction } from 'ember-resources/util/function';
type Args = {
  zonality?: SkosConcept;
  onChange: (zonality?: SkosConcept) => void;
};
export default class ZonalitySelectorComponent extends Component<Args> {
  @service declare store: Store;

  zonalities = trackedFunction(this, async () => {
    const conceptScheme = await this.store.findRecord(
      'concept-scheme',
      ZON_CONCEPT_SCHEME_ID,
    );
    return conceptScheme.concepts;
  });

  get selectedZonality() {
    if (this.args.zonality) {
      return this.args.zonality;
    } else {
      return this.zonalities.value?.find(
        (zonality) => zonality.id == ZON_NON_ZONAL_ID,
      );
    }
  }
}
