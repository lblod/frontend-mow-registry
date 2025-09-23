import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';

type Sig = {
  Args: {
    code: string | undefined;
    imageUrl: string | undefined;
    meaning: string | undefined;
    addText: string;
    onAdd: () => void;
  };
  Element: HTMLElement;
};

const SidebarTrafficSignal: TOC<Sig> = <template>
  <div
    class='sidebar-road-sign au-c-action-sidebar__item au-o-box au-o-box--small flex'
    ...attributes
  >
    {{! template-lint-disable no-inline-styles }}
    <div class='flex-shrink-0' style='width: 80px;'>
      <img class='au-c-thumbnail' alt='' src={{@imageUrl}} />
    </div>
    <div class='flex-grow au-u-margin-left-small au-u-margin-right-small'>
      <p>
        <strong>
          {{@code}}
        </strong>
      </p>
      <p class='max-w-prose'>
        {{@meaning}}
      </p>
    </div>
    <div class='flex-shrink-0 self-center'>
      <AuButton
        @icon='add'
        @skin='secondary'
        @hideText={{true}}
        {{on 'click' @onAdd}}
      >
        {{@addText}}
      </AuButton>
    </div>
  </div>
</template>;

export default SidebarTrafficSignal;
