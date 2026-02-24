import type { TOC } from '@ember/component/template-only';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';

type Signature = {
  Args: {
    onConfirm: (event?: MouseEvent) => void;
    onCancel: () => void;
    isAlert?: boolean;
    isLoading?: boolean;
    cancelButtonText?: string;
    confirmButtonText?: string;
  };
  Blocks: {
    cancelButton: [];
    confirmButton: [];
    secondaryButton: [];
  };
};

const ConfirmationModalFooter: TOC<Signature> = <template>
  <AuToolbar @reverse={{true}} as |Group|>
    <Group>
      <AuButtonGroup>
        <AuButton
          @skin='secondary'
          {{on 'click' @onCancel}}
          @disabled={{@isLoading}}
        >
          {{#if @cancelButtonText}}
            {{@cancelButtonText}}
          {{else}}
            {{t 'utility.cancel'}}
          {{/if}}
        </AuButton>
        <AuButton
          @alert={{@isAlert}}
          {{on 'click' @onConfirm}}
          @loading={{@isLoading}}
        >
          {{#if @confirmButtonText}}
            {{@confirmButtonText}}
          {{else}}
            {{t 'utility.confirmation.title'}}
          {{/if}}
        </AuButton>
      </AuButtonGroup>
    </Group>
    {{#if (has-block 'secondaryButton')}}
      <Group>
        {{yield to='secondaryButton'}}
      </Group>
    {{/if}}
  </AuToolbar>
</template>;

export default ConfirmationModalFooter;
