import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import type { TOC } from '@ember/component/template-only';
import t from 'ember-intl/helpers/t';
import sortableGroup from 'ember-sortable/modifiers/sortable-group';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import TrafficMeasureInstructionEntry from 'mow-registry/components/traffic-measure/instruction-entry';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
    removeSign: (sign: TrafficSignalListItem) => void;
    onSort: (
      sings: TrafficSignalListItem[],
      moved?: TrafficSignalListItem,
    ) => void;
  };
};

const SignList: TOC<Sig> = <template>
  <div class='au-c-table-wrapper au-u-margin-bottom'>
    {{! template-lint-disable table-groups }}
    <table class='au-c-table'>
      <thead class='au-c-table__header'>
        <tr>
          <th>{{t 'utility.order'}}</th>
          <th>{{t 'utility.sign'}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody
        class='au-c-table__body'
        {{sortableGroup groupName='signs' onChange=@onSort}}
      >
        {{#each @signs as |sign|}}
          <TrafficMeasureInstructionEntry
            @sign={{sign}}
            @removeSign={{@removeSign}}
          />
        {{else}}
          <tr>
            <td colspan='3'>
              <AuHelpText @size='normal' @skin='tertiary'>
                {{t 'utility.no-instruction'}}
              </AuHelpText>
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
</template>;

export default SignList;
