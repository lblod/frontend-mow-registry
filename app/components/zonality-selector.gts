import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { get } from '@ember/helper';
import { findRecord } from '@warp-drive/legacy/compat/builders';
import { ZON_CONCEPT_SCHEME_ID } from '../utils/constants';
import type Store from 'mow-registry/services/store';
import SkosConcept from 'mow-registry/models/skos-concept';
import { trackedFunction } from 'reactiveweb/function';
import type ConceptScheme from 'mow-registry/models/concept-scheme';
import AuRadioGroup from '@appuniversum/ember-appuniversum/components/au-radio-group';
import ErrorMessage from 'mow-registry/components/error-message';
import zonalityLabel from 'mow-registry/helpers/zonality-label';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import type { PromiseBelongsTo } from '@warp-drive/legacy/model/-private/promise-belongs-to';

type Sig = {
  Args: {
    model: TrafficSignalConcept | TrafficMeasureConcept;
    zonality: PromiseBelongsTo<SkosConcept> | SkosConcept;
    onChange: (zonality: SkosConcept) => void;
  };
};

export default class ZonalitySelectorComponent extends Component<Sig> {
  @service declare store: Store;
  @tracked zonalitySelected: SkosConcept | null = null;

  zonalities = trackedFunction(this, async () => {
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const conceptScheme = await this.store
      .request(
        findRecord<ConceptScheme>('concept-scheme', ZON_CONCEPT_SCHEME_ID),
      )
      .then((res) => res.content);
    return conceptScheme.concepts;
  });

  selection = trackedFunction(this, async () => {
     // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
     await Promise.resolve();
    const zonality = await this.args.zonality;
    this.zonalitySelected = zonality;
    return zonality;
  });

  get selected() {
    return this.zonalitySelected ?? this.selection.value;
  }

  @action
  onChange(zonalityUri: string | undefined) {
    if (zonalityUri) {
      const zonality = this.zonalities.value?.find(zonality => zonality.uri === zonalityUri);
      if(!zonality) return
      this.zonalitySelected = zonality;
      void this.args.onChange(zonality);
    }
  }

  <template>
    {{#let (get @model.error 'zonality') as |error|}}
      <div class={{if error 'ember-power-select--error'}}>
        {{#if this.zonalities.value}}
          <AuRadioGroup
            @selected={{this.selected.uri}}
            @onChange={{this.onChange}}
            as |Group|
          >
            {{#each this.zonalities.value as |zonality|}}
              {{! @glint-expect-error should convert this to a function }}
              <Group.Radio @value={{zonality.uri}}>{{zonalityLabel zonality}}</Group.Radio>
            {{/each}}
          </AuRadioGroup>
        {{/if}}
        <ErrorMessage @error={{error}} />
      </div>
    {{/let}}
    <br />
  </template>
}
