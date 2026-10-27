import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { and, eq, not, notEq, or } from 'ember-truth-helpers';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import PowerSelectInput from 'ember-power-select/components/power-select/input';
import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';
import isSelectedPresent from 'ember-power-select/helpers/ember-power-select-is-selected-present';
import type { Select } from 'ember-power-select/components/power-select';

type AddSignTriggerArgs = {
  select: Select;
  allowClear?: boolean;
  searchEnabled?: boolean;
  placeholder?: string;
  searchFieldPosition?: string;
  placeholderComponent?: unknown;
  selectedItemComponent?: unknown;
  extra?: unknown;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
  ariaActiveDescendant: string;
  listboxId?: string;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onInput?: (e: InputEvent) => string | false | void;
  onKeydown?: (e: KeyboardEvent) => boolean | void;
};

export default class AddSignTriggerComponent extends Component<{
  Args: AddSignTriggerArgs;
  Element: HTMLElement;
  Blocks: { default: [selected: unknown, select: Select] };
}> {
  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }

  <template>
    {{#if (isSelectedPresent @select.selected)}}
      {{#if (or (notEq @searchFieldPosition 'trigger') (not @select.searchText))}}
        {{#if @selectedItemComponent}}
          <@selectedItemComponent
            @extra={{@extra}}
            @option={{@select.selected}}
            @select={{@select}}
          />
        {{else}}
          <span class='ember-power-select-selected-item'>
            {{yield @select.selected @select}}
          </span>
        {{/if}}
      {{/if}}
      {{#if (and @searchEnabled (eq @searchFieldPosition 'trigger'))}}
        <PowerSelectInput
          @select={{@select}}
          @ariaActiveDescendant={{@ariaActiveDescendant}}
          @ariaLabelledBy={{@ariaLabelledBy}}
          @ariaDescribedBy={{@ariaDescribedBy}}
          @role={{@role}}
          @ariaLabel={{@ariaLabel}}
          @listboxId={{@listboxId}}
          @searchPlaceholder={{@placeholder}}
          @onFocus={{@onFocus}}
          @onBlur={{@onBlur}}
          @onKeydown={{@onKeydown}}
          @onInput={{@onInput}}
          @searchFieldPosition={{@searchFieldPosition}}
          @autofocus={{false}}
        />
      {{/if}}
      {{#if (and @allowClear (not @select.disabled))}}
        <span
          class='ember-power-select-clear-btn'
          role='button'
          {{on 'mousedown' this.clear}}
          {{on 'touchstart' this.clear}}
        >&times;</span>
      {{/if}}
    {{else}}
      {{#if (and @searchEnabled (eq @searchFieldPosition 'trigger'))}}
        <PowerSelectPlaceholder
          @select={{@select}}
          @placeholder={{@placeholder}}
          @isMultipleWithSearch={{true}}
          @inputComponent={{(
            component PowerSelectInput
            select=@select
            ariaActiveDescendant=@ariaActiveDescendant
            ariaLabelledBy=@ariaLabelledBy
            ariaDescribedBy=@ariaDescribedBy
            role=@role
            ariaLabel=@ariaLabel
            listboxId=@listboxId
            searchPlaceholder=@placeholder
            onFocus=@onFocus
            onBlur=@onBlur
            onKeydown=@onKeydown
            onInput=@onInput
            searchFieldPosition=@searchFieldPosition
            autofocus=false
          )}}
          @displayPlaceholder={{and (not @select.searchText) (not @select.selected)}}
        />
      {{else}}
        <PowerSelectPlaceholder @placeholder={{@placeholder}} />
      {{/if}}
    {{/if}}
    <AuIcon @icon='search' @ariaHidden='true' class='add-sign__trigger-icon' />
  </template>
}
