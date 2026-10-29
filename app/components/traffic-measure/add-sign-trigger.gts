import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { and, eq, not, notEq, or } from 'ember-truth-helpers';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import PowerSelectInput from 'ember-power-select/components/power-select/input';
import isSelectedPresent from 'ember-power-select/helpers/ember-power-select-is-selected-present';
import type { Select, TSearchFieldPosition } from 'ember-power-select/components/power-select';
import type { ComponentLike } from '@glint/template';

interface AddSignTriggerSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    allowClear: boolean;
    searchEnabled: boolean;
    placeholder?: string;
    searchField: string;
    searchFieldPosition?: TSearchFieldPosition;
    listboxId?: string;
    tabindex?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    ariaActiveDescendant: string;
    extra?: unknown;
    placeholderComponent: ComponentLike<{
      select?: Select;
      placeholder?: string;
      isMultipleWithSearch?: boolean;
      inputComponent?: unknown;
      displayPlaceholder?: boolean;
    }>;
    selectedItemComponent?: ComponentLike<{
      extra?: unknown;
      option?: unknown;
      select?: Select;
    }>;
    onInput: (e: InputEvent) => boolean;
    onKeydown: (e: KeyboardEvent) => false | void;
    onFocus: (e: FocusEvent) => void;
    onBlur: (e: FocusEvent) => void;
  };
  Blocks: {
    default: [selected: unknown, select: Select];
  };
}

export default class AddSignTriggerComponent extends Component<AddSignTriggerSignature> {
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
          {{#let (component @selectedItemComponent) as |SelectedItemComponent|}}
            <SelectedItemComponent
              @extra={{@extra}}
              @option={{@select.selected}}
              @select={{@select}}
            />
          {{/let}}
        {{else}}
          <span class='ember-power-select-selected-item'>{{yield
              @select.selected
              @select
            }}</span>
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
        {{! template-lint-disable no-pointer-down-event-binding }}
        <span
          class='ember-power-select-clear-btn'
          role='button'
          {{on 'mousedown' this.clear}}
          {{on 'touchstart' this.clear}}
        >&times;</span>
      {{/if}}
    {{else}}
      {{#if (and @searchEnabled (eq @searchFieldPosition 'trigger'))}}
        {{#let
          (component
            PowerSelectInput
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
          )
          as |InputComponent|
        }}
          {{#let (component @placeholderComponent) as |PlaceholderComponent|}}
            <PlaceholderComponent
              @select={{@select}}
              @placeholder={{@placeholder}}
              @isMultipleWithSearch={{true}}
              @inputComponent={{InputComponent}}
              @displayPlaceholder={{and
                (not @select.searchText)
                (not @select.selected)
              }}
            />
          {{/let}}
        {{/let}}
      {{else}}
        {{#let (component @placeholderComponent) as |PlaceholderComponent|}}
          <PlaceholderComponent @placeholder={{@placeholder}} />
        {{/let}}
      {{/if}}
    {{/if}}
    <AuIcon @icon='search' @ariaHidden='true' class='add-sign__trigger-icon' />
  </template>
}
