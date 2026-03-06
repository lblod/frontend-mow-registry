import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import CodeList from 'mow-registry/models/code-list';
import t from 'ember-intl/helpers/t';
import CodelistForm from '../codelist-form';
import type SkosConcept from 'mow-registry/models/skos-concept';
import type CodeListValue from 'mow-registry/models/code-list-value';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import type Store from 'mow-registry/services/store';
import { recordIdentifierFor } from '@warp-drive/core';

type Sig = {
  Args: {
    modalOpen: boolean;
    onCloseModal: () => void;
    codelist: CodeList;
    onGoToEditConcept: (concept?: SkosConcept | CodeListValue) => void;
    onGoBack: () => void;
  };
};

export default class CodelistManager extends Component<Sig> {
  @service declare store: Store;
  onCloseModal = async () => {
    this.store.cache.rollbackRelationships(
      recordIdentifierFor(this.args.codelist),
    );
    this.args.onGoBack();
    this.store.cache.rollbackAttrs(recordIdentifierFor(this.args.codelist));
    this.args.onGoBack();
  };
  <template>
    {{#if @modalOpen}}
      <CodelistForm
        @codelist={{@codelist}}
        @hideHeading={{true}}
        @hideBody={{true}}
        @onNavigateAway={{@onGoBack}}
        @onGoToEditConcept={{@onGoToEditConcept}}
        as |form|
      >
        <AuModal @modalOpen={{@modalOpen}} @closeModal={{this.onCloseModal}}>
          <:title>
            {{t 'codelist-form.modal-title'}}
          </:title>
          <:body>
            <div class='edit-variable-form--codelist-modal'>
              <AuToolbar
                class='au-u-margin-bottom codelist-manager--toolbar'
                @skin='tint'
                as |Group|
              >
                <Group>
                  <AuButton
                    class='au-u-padding'
                    {{on 'click' this.onCloseModal}}
                    @skin='link'
                    @icon='chevron-left'
                  >
                    {{t 'codelist-form.go-back'}}
                  </AuButton>
                </Group>
              </AuToolbar>
              <form.FormBody />
            </div>
          </:body>
          <:footer>
            <form.FormControls />
          </:footer>
        </AuModal>
      </CodelistForm>
    {{/if}}
  </template>
}
