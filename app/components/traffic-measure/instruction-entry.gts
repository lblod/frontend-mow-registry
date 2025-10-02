import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';
import sortableItem from 'ember-sortable/modifiers/sortable-item';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';

type Sig = {
  Args: {
    sign: TrafficSignalListItem;
    removeSign: (sign: TrafficSignalListItem) => void;
  };
};

const InstructionEntry: TOC<Sig> = <template>
  <tr
    class='au-c-table__row--centered'
    {{sortableItem groupName='signs' model=@sign}}
  >
    <td class='w-px au-u-padding-right-small'>
      <AuButton
        @icon='drag'
        @skin='link'
        @hideText={{true}}
        class='au-c-button--drag'
      >
        {{t 'utility.drag'}}
      </AuButton>
    </td>
    <td>
      <div class='au-o-flex au-o-flex--center'>
        <img
          src={{get (get (get @sign.item 'image') 'file') 'downloadLink'}}
          alt=''
          class='au-c-thumbnail au-c-thumbnail--table'
        />
        <span>
          {{get @sign.item 'label'}}
        </span>
      </div>
    </td>
    <td class='w-px au-u-padding-right-small'>
      <AuButton
        @icon='bin'
        @alert={{true}}
        @skin='secondary'
        @hideText={{true}}
        {{on 'click' (fn @removeSign @sign)}}
      >
        {{t 'utility.delete'}}
      </AuButton>
    </td>
  </tr>
</template>;

export default InstructionEntry;
