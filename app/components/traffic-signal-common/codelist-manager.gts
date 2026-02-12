import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import CodeList from 'mow-registry/models/code-list';
import t from 'ember-intl/helpers/t';
import CodelistForm from '../codelist-form';
import type { TOC } from '@ember/component/template-only';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type CodeListValue from 'mow-registry/models/code-list-value';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';

type Sig = {
  Args: {
    modalOpen: boolean;
    closeModal: () => void;
    codelist?: CodeList;
    goToEditConcept: (concept?: SkosConcept | CodeListValue) => void;
    goBack: () => void;
  };
};

// We need to check for codelist in order to solve a stupid typing problem if someone knows any other way pls fix :)
const CodelistManager: TOC<Sig> = <template>
  {{#if @codelist}}
    {{#if @modalOpen}}
      <CodelistForm
        @codelist={{@codelist}}
        @customHeading={{true}}
        @customBody={{true}}
        @customCallback={{@goBack}}
        @goToEditConcept={{@goToEditConcept}}
        as |form|
      >
        <AuModal @modalOpen={{@modalOpen}} @closeModal={{@closeModal}}>
          <:title>
            {{t 'utility.confirmation.title'}}
          </:title>
          <:body>
            <AuButton
              {{on 'click' @goBack}}
              @skin='link'
              @icon='chevron-left'
              class='au-u-margin-bottom'
            >
              {{t 'codelist-form.go-back'}}
            </AuButton>
            <form.FormBody />
          </:body>
          <:footer>
            <form.FormControls />
          </:footer>
        </AuModal>
      </CodelistForm>
    {{/if}}
  {{/if}}
</template>;

export default CodelistManager;
