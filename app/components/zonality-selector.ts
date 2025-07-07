import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { ZON_CONCEPT_SCHEME_ID } from '../utils/constants';
import type Store from '@ember-data/store';
import SkosConcept from 'mow-registry/models/skos-concept';
import { trackedFunction } from 'reactiveweb/function';
import type ConceptScheme from 'mow-registry/models/concept-scheme';

type Args = {
  zonality: SkosConcept;
  onChange: (zonality: SkosConcept) => void;
};

export default class ZonalitySelectorComponent extends Component<Args> {
  @service declare store: Store;

  zonalities = trackedFunction(this, async () => {
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const conceptScheme = await this.store.findRecord<ConceptScheme>(
      'concept-scheme',
      ZON_CONCEPT_SCHEME_ID,
    );
    return conceptScheme.concepts;
  });

  get selectedZonality() {
    return this.args.zonality;
  }
}
