import type { TOC } from '@ember/component/template-only';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';

type Signature = {
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
        {{yield to='cancelButton'}}
        {{yield to='confirmButton'}}
      </AuButtonGroup>
    </Group>
    {{#if (has-block 'secondaryButton')}}
      <Group>
        {{yield to='secondaryButton'}}
      </Group>
    {{/if}}
  </AuToolbar>
</template>;

export { ConfirmationModalFooter };
