import type { TOC } from '@ember/component/template-only';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import t from 'ember-intl/helpers/t';
import ConfirmationModalFooter from 'mow-registry/components/confirmation-modal-footer';

type Signature = {
  Args: {
    modalOpen?: boolean;
    titleText?: string;
    bodyText?: string;
    onConfirm: (event?: MouseEvent) => void;
    onCancel: () => void;
    isLoading?: boolean;
    isAlert?: boolean;
    cancelButtonText?: string;
    confirmButtonText?: string;
  };
  Blocks: {
    title: [];
    body: [];
  };
};
const ConfirmationModal: TOC<Signature> = <template>
  <AuModal @modalOpen={{@modalOpen}} @closeModal={{@onCancel}}>
    <:title>
      {{#if (has-block 'title')}}
        {{yield to='title'}}
      {{else if @titleText}}
        {{@titleText}}
      {{else}}
        {{t 'utility.confirmation.title'}}
      {{/if}}
    </:title>
    <:body>
      {{#if (has-block 'body')}}
        {{yield to='body'}}
      {{else if @bodyText}}
        {{@bodyText}}
      {{/if}}
    </:body>
    <:footer>
      <ConfirmationModalFooter
        @isAlert={{@isAlert}}
        @onConfirm={{@onConfirm}}
        @isLoading={{@isLoading}}
        @onCancel={{@onCancel}}
        @confirmButtonText={{@confirmButtonText}}
        @cancelButtonText={{@cancelButtonText}}
      />
    </:footer>
  </AuModal>
</template>;

export default ConfirmationModal;
