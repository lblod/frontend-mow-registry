import { cached, tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Variable, {
  signVariableTypes,
  type VariableType,
} from 'mow-registry/models/variable';
import type CodelistsService from 'mow-registry/services/codelists';
import type Store from 'mow-registry/services/store';
import Component from '@glimmer/component';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import ReactiveTable from 'mow-registry/components/reactive-table';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { trackedFunction } from 'reactiveweb/function';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import humanFriendlyDate from 'mow-registry/helpers/human-friendly-date';
import { getPromiseState } from '@warp-drive/ember';
import type VariablesService from 'mow-registry/services/variables-service';
import { isCodelistVariable } from 'mow-registry/models/codelist-variable';
import { isSome } from 'mow-registry/utils/option';
import { isTextVariable } from 'mow-registry/models/text-variable';
import { isDateVariable } from 'mow-registry/models/date-variable';
import { isNumberVariable } from 'mow-registry/models/number-variable';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';
import { query } from '@warp-drive/legacy/compat/builders';
import { task } from 'ember-concurrency';
import ConfirmationModalFooter from 'mow-registry/components/confirmation-modal-footer';

interface Signature {
  Args: {
    trafficSignal: TrafficSignalConcept;
    pageNumber: number;
    pageSize: number;
    sort?: string;
    onPageChange: (newPage: number) => unknown;
    onSortChange: (newSort?: string) => unknown;
    goToEditVariable: (variable?: Variable) => void;
  };
}

export default class VariableManager extends Component<Signature> {
  @service('codelists') declare codeListService: CodelistsService;
  @service declare store: Store;
  @service declare variablesService: VariablesService;

  @tracked variableToEdit?: Variable;
  @tracked isEditVariableModalOpen = false;

  @tracked variableToDelete?: Variable;
  @tracked isDeleteConfirmationOpen = false;

  get variableTypes() {
    return signVariableTypes;
  }

  labelForType = (variableType: VariableType) => {
    return this.variablesService.defaultLabelForVariableType(variableType);
  };

  codelists = trackedFunction(this, async () => {
    return await this.codeListService.all.perform();
  });

  variables = trackedFunction(this, async () => {
    const { pageNumber, pageSize, sort } = this.args;
    const trafficSignalId = this.args.trafficSignal.id;
    await Promise.resolve();
    const variables = await this.store
      .request(
        query<Variable>('variable', {
          'filter[traffic-signal-concept][:id:]': trafficSignalId,
          page: {
            number: pageNumber,
            size: pageSize,
          },
          sort: sort,
        }),
      )
      .then((res) => res.content);
    return variables;
  });

  startDeleteVariableFlow = (variable: Variable) => {
    this.variableToDelete = variable;
    this.isDeleteConfirmationOpen = true;
  };

  removeVariable = task(async () => {
    await this.variableToDelete?.destroyRecord();
    this.variables.retry();
    this.closeDeleteConfirmation();
  });

  closeDeleteConfirmation = () => {
    this.variableToDelete = undefined;
    this.isDeleteConfirmationOpen = false;
  };
  <template>
    {{#if this.codelists.isResolved}}
      <ReactiveTable
        @content={{this.variables.value}}
        @isLoading={{this.variables.isLoading}}
        @noDataMessage={{t 'variable-manager.no-data'}}
        @page={{@pageNumber}}
        @pageSize={{@pageSize}}
        @onPageChange={{@onPageChange}}
        @onSortChange={{@onSortChange}}
        @sort={{@sort}}
      >
        <:menu>
          <div class='au-u-flex au-u-flex--end'>
            <AuButton
              @skin='secondary'
              @icon='plus'
              {{on 'click' (fn @goToEditVariable undefined)}}
              class='au-u-margin-small'
            >
              {{t 'utility.add-variable'}}
            </AuButton>
          </div>

        </:menu>
        <:header as |header|>
          <header.Sortable @field='label' @label={{t 'utility.variable'}} />
          <header.Sortable @field='type' @label={{t 'utility.type'}} />
          <header.Sortable @field='required' @label={{t 'utility.required'}} />
          <th>{{t 'variable-manager.table.fields.default-value'}}</th>
          <header.Sortable
            @field='createdOn'
            @label={{t 'utility.created-on'}}
          />
          <th></th>
        </:header>
        <:body as |variable|>
          <td>
            {{variable.label}}
          </td>
          <td>
            {{#if variable.type}}
              {{this.labelForType variable.type}}
            {{/if}}
          </td>
          <td>
            {{#if variable.required}}
              {{t 'utility.yes'}}
            {{else}}
              {{t 'utility.no'}}
            {{/if}}
          </td>
          <td><VariableDefaultValueLabel @variable={{variable}} /></td>
          <td>
            {{#if variable.createdOn}}
              {{humanFriendlyDate variable.createdOn}}
            {{/if}}
          </td>
          <td>
            <AuButton
              @skin='naked'
              {{on 'click' (fn @goToEditVariable variable)}}
            >
              <AuIcon @icon='pencil' @size='large' />
            </AuButton>
            <AuButton
              @skin='naked'
              @alert={{true}}
              {{on 'click' (fn this.startDeleteVariableFlow variable)}}
            >
              <AuIcon @icon='trash' @size='large' />
            </AuButton>
          </td>

        </:body>
      </ReactiveTable>

      <AuModal
        @modalOpen={{this.isDeleteConfirmationOpen}}
        @closeModal={{this.closeDeleteConfirmation}}
      >
        <:title>
          {{t 'utility.confirmation.title'}}
        </:title>
        <:body>
          <p>
            {{t 'utility.confirmation.body'}}
          </p>
        </:body>
        <:footer>
          <ConfirmationModalFooter>
            <:cancelButton>
              <AuButton
                @skin='secondary'
                {{on 'click' this.closeDeleteConfirmation}}
                @disabled={{this.removeVariable.isRunning}}
              >
                {{t 'utility.cancel'}}
              </AuButton>
            </:cancelButton>
            <:confirmButton>
              <AuButton
                @alert={{true}}
                {{on 'click' this.removeVariable.perform}}
                @loading={{this.removeVariable.isRunning}}
                @loadingMessage={{t 'utility.loading'}}
              >
                {{t 'variable-manager.delete'}}
              </AuButton>
            </:confirmButton>
          </ConfirmationModalFooter>
        </:footer>
      </AuModal>
    {{/if}}
  </template>
}

class VariableDefaultValueLabel extends Component<{
  Args: { variable: Variable };
}> {
  @cached
  get defaultValueRepr() {
    const variable = this.args.variable;
    if (isTextVariable(variable)) {
      return isSome(variable.defaultValue)
        ? `"${variable.defaultValue}"`
        : null;
    } else if (isNumberVariable(variable)) {
      return variable.defaultValue;
    } else if (isDateVariable(variable)) {
      return isSome(variable.defaultValue)
        ? format(variable.defaultValue, 'dd-MM-yyyy', { locale: locales.nlBE })
        : null;
    } else if (isCodelistVariable(variable)) {
      const defaultValuePromiseState = getPromiseState(variable.defaultValue);
      return defaultValuePromiseState.isSuccess &&
        defaultValuePromiseState.value
        ? `"${defaultValuePromiseState.value.label}"`
        : null;
    } else {
      return;
    }
  }

  <template>
    {{#if (isSome this.defaultValueRepr)}}
      {{!template-lint-disable no-bare-strings}}
      <span>{{this.defaultValueRepr}}</span>
    {{else}}
      <span class='au-u-italic'>{{t 'utility.n/a'}}</span>
    {{/if}}
  </template>
}
