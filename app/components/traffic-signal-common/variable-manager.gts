import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { get, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { trackedFunction } from 'reactiveweb/function';
import { eq } from 'ember-truth-helpers';
import t from 'ember-intl/helpers/t';
import PowerSelect from 'ember-power-select/components/power-select';
import AuFieldset from '@appuniversum/ember-appuniversum/components/au-fieldset';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import Variable, {
  signVariableTypes,
  type SignVariableType,
} from 'mow-registry/models/variable';
import type CodelistsService from 'mow-registry/services/codelists';
import type CodeList from 'mow-registry/models/code-list';
import ErrorMessage from 'mow-registry/components/error-message';
import { isSome } from 'mow-registry/utils/option';
import type VariablesService from 'mow-registry/services/variables-service';

interface Signature {
  Args: {
    variables: Variable[];
    addVariable: () => void;
    removeVariable: (variableToRemove: Variable) => void;
  };
}

export default class VariableManager extends Component<Signature> {
  @service declare store: Store;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare variablesService: VariablesService;

  get variableTypes() {
    return signVariableTypes;
  }

  labelForType = (variableType: SignVariableType) => {
    return this.variablesService.labelForVariableType(variableType);
  };

  codelists = trackedFunction(this, async () => {
    return await this.codeListService.all.perform();
  });

  @action
  setVariableLabel(variable: Variable, event: Event) {
    const newLabel = (event.target as HTMLInputElement).value;
    variable.label = newLabel;
  }

  @action
  toggleVariableRequired(variable: Variable) {
    variable.required = !variable.required;
  }

  @action
  setVariableType(
    varIndex: number,
    existing: Variable,
    selectedType: SignVariableType,
  ) {
    const newVar = this.variablesService.convertVariableType(
      existing,
      selectedType,
    );
    this.args.variables.splice(varIndex, 1, newVar as Variable);
  }

  @action
  updateCodelist(variable: Variable, codeList?: CodeList) {
    variable.set('codeList', codeList);
  }

  <template>
    <AuFieldset as |f|>
      <f.legend @required={{false}}>
        {{t 'utility.variables'}}
      </f.legend>
      <f.content class='au-u-1-1'>
        <div class='au-o-flow'>
          {{#if this.codelists.isResolved}}
            {{#if @variables}}
              <AuTable>
                <:header>
                  <tr>
                    <th>{{t 'utility.type'}}</th>
                    <th>{{t 'utility.variable'}}</th>
                    <th>{{t 'utility.required'}}</th>
                    <th></th>
                  </tr>
                </:header>
                <:body>
                  {{#each @variables as |variable varIndex|}}
                    <tr>
                      {{! template-lint-disable no-inline-styles }}
                      <td style='width: 33%;'>
                        <div
                          class={{if
                            (get variable.error 'type')
                            'ember-power-select--error'
                          }}
                        >
                          {{! @glint-expect-error need to move to PS 8 }}
                          <PowerSelect
                            {{! @glint-expect-error need to move to PS 8 }}
                            @allowClear={{false}}
                            @searchEnabled={{false}}
                            @options={{this.variableTypes}}
                            @loadingMessage={{t 'utility.loading'}}
                            @selected={{variable.type}}
                            @onChange={{fn
                              this.setVariableType
                              varIndex
                              variable
                            }}
                            as |type|
                          >
                            {{this.labelForType type}}
                          </PowerSelect>
                          <ErrorMessage @error={{get variable.error 'type'}} />
                        </div>
                        {{#if (eq variable.type 'codelist')}}
                          {{! @glint-expect-error need to move to PS 8 }}
                          <PowerSelect
                            @triggerClass='au-u-margin-top-tiny'
                            @allowClear={{false}}
                            @searchEnabled={{true}}
                            {{! @glint-expect-error need to move to PS 8 }}
                            @options={{this.codelists.value}}
                            {{! @glint-expect-error we dont type guard on variable type }}
                            @selected={{variable.codeList}}
                            @onChange={{fn this.updateCodelist variable}}
                            as |codeList|
                          >
                            {{codeList.label}}
                          </PowerSelect>
                          <ul
                            class='au-c-list-help au-c-help-text au-c-help-text--secondary'
                          >
                            {{! @glint-expect-error we dont type guard on variable type }}
                            {{#each variable.codeList.concepts as |option|}}
                              <li
                                class='au-c-list-help__item'
                              >{{option.label}}</li>
                            {{/each}}
                          </ul>
                          {{! @glint-expect-error we dont type guard on variable type }}
                          <ErrorMessage @error={{variable.error.codelist}} />
                        {{/if}}
                      </td>
                      <td>
                        <AuInput
                          value={{variable.label}}
                          @error={{isSome (get variable.error 'label')}}
                          {{on 'input' (fn this.setVariableLabel variable)}}
                        />
                        <ErrorMessage @error={{get variable.error 'label'}} />
                      </td>
                      {{! template-lint-disable no-inline-styles }}
                      <td style='width: 33%;'>
                        <AuCheckbox
                          @checked={{variable.required}}
                          @onChange={{fn this.toggleVariableRequired variable}}
                        >
                          {{t 'utility.required'}}
                        </AuCheckbox>
                      </td>
                      <td>
                        <AuButton
                          @skin='naked'
                          @icon='bin'
                          @alert={{true}}
                          {{on 'click' (fn @removeVariable variable)}}
                        >
                          {{t 'utility.delete'}}
                        </AuButton></td>
                    </tr>
                  {{/each}}
                </:body>
              </AuTable>
            {{/if}}
          {{else}}
            <AuLoader @inline={{true}} @message={{t 'utility.loading'}} />
          {{/if}}
          <AuButton
            @disabled={{this.codelists.isPending}}
            @skin='secondary'
            @width='block'
            @icon='plus'
            {{on 'click' @addVariable}}
          >{{t 'utility.add-variable'}}</AuButton>

        </div>
      </f.content>
    </AuFieldset>
  </template>
}
