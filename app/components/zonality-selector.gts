import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { ZON_CONCEPT_SCHEME_ID } from '../utils/constants';
import type Store from '@ember-data/store';
import SkosConcept from 'mow-registry/models/skos-concept';
import { trackedFunction } from 'reactiveweb/function';
import type ConceptScheme from 'mow-registry/models/concept-scheme';
import PowerSelect from 'ember-power-select/components/power-select';
import ErrorMessage from 'mow-registry/components/error-message';
import zonalityLabel from 'mow-registry/helpers/zonality-label';
import t from 'ember-intl/helpers/t';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import { get } from '@ember/helper';

type Args = {
  model: TrafficSignalConcept;
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
  <template>
    {{#let (get @model.error 'zonality') as |error|}}
      <div class={{if error 'ember-power-select--error'}}>
        {{#if this.zonalities.value}}
          {{! @glint-expect-error need to move to PS 8 }}
          <PowerSelect
            {{! @glint-expect-error need to move to PS 8 }}
            @allowClear={{false}}
            @searchEnabled={{false}}
            @loadingMessage={{t 'utility.loading'}}
            @options={{this.zonalities.value}}
            @selected={{@zonality}}
            @onChange={{@onChange}}
            as |zonality|
          >
            {{! @glint-expect-error should convert this to a function }}
            {{zonalityLabel zonality}}
          </PowerSelect>
        {{/if}}
        <ErrorMessage @error={{error}} />
      </div>
    {{/let}}
    <br />
  </template>
}
