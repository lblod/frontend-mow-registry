import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';

type Sig = {
  Args: {
    onClose: () => void;
  };
  Blocks: {
    title: [];
    content: [];
  };
};

const SidebarHeader: TOC<Sig> = <template>
  <div class='au-o-box au-c-action-sidebar__header'>
    <AuToolbar class='au-u-margin-bottom-small' as |Group|>
      <Group>
        <AuHeading @level='2' @skin='3'>
          {{yield to='title'}}
        </AuHeading>
      </Group>
      <button
        type='button'
        class='au-c-close au-c-close--large'
        {{on 'click' @onClose}}
      >
        <AuIcon @icon='cross' @size='large' />
        <span class='au-u-hidden-visually'>
          {{t 'utility.close'}}
        </span>
      </button>
    </AuToolbar>
    {{yield to='content'}}
  </div>
</template>;

export default SidebarHeader;
