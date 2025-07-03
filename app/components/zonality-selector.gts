import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { ZON_CONCEPT_SCHEME_ID } from "../utils/constants";
import type Store from "@ember-data/store";
import SkosConcept from "mow-registry/models/skos-concept";
import { trackedFunction } from "ember-resources/util/function";
import type ConceptScheme from "mow-registry/models/concept-scheme";
import PowerSelect from "ember-power-select/components/power-select";
import ErrorMessage from "mow-registry/components/error-message";
import zonalityLabel from "mow-registry/helpers/zonality-label";
import t from "ember-intl/helpers/t";

type Args = {
  zonality: SkosConcept;
  onChange: (zonality: SkosConcept) => void;
};

export default class ZonalitySelectorComponent extends Component<Args> {
  @service declare store: Store;

  zonalities = trackedFunction(this, async () => {
    const conceptScheme = await this.store.findRecord<ConceptScheme>(
      "concept-scheme",
      ZON_CONCEPT_SCHEME_ID,
    );
    return conceptScheme.concepts;
  });

  get selectedZonality() {
    return this.args.zonality;
  }
  <template>
    {{#let @model.error.zonality as |error|}}
      <div class={{if error "ember-power-select--error"}}>
        <PowerSelect
          @allowClear={{false}}
          @searchEnabled={{false}}
          @loadingMessage={{t "utility.loading"}}
          @options={{this.zonalities.value}}
          @selected={{@zonality}}
          @onChange={{@onChange}}
          as |zonality|
        >
          {{zonalityLabel zonality}}
        </PowerSelect>
        <ErrorMessage @error={{error}} />
      </div>
    {{/let}}
    <br />
  </template>
}
