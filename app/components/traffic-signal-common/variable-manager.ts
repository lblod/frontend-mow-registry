import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import Variable from 'mow-registry/models/variable';
import IntlService from 'ember-intl/services/intl';
import type CodelistsService from 'mow-registry/services/codelists';
import type CodeList from 'mow-registry/models/code-list';
import { trackedFunction } from 'reactiveweb/function';

interface Signature {
  Args: {
    variables: Variable[];
    addVariable: () => void;
    removeVariable: (variableToRemove: Variable) => void;
  };
}

const VARIABLE_TYPES = [
  'text',
  'number',
  'date',
  'location',
  'codelist',
] as const;

type VariableType = (typeof VARIABLE_TYPES)[number];

export default class VariableManager extends Component<Signature> {
  @service declare store: Store;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;

  get variableTypes() {
    return VARIABLE_TYPES;
  }

  labelForType = (variableType: VariableType) => {
    switch (variableType) {
      case 'text':
        return this.intl.t('utility.template-variables.text');
      case 'number':
        return this.intl.t('utility.template-variables.number');
      case 'date':
        return this.intl.t('utility.template-variables.date');
      case 'location':
        return this.intl.t('utility.template-variables.location');
      case 'codelist':
        return this.intl.t('utility.template-variables.codelist');
    }
  };

  codelists = trackedFunction(this, async () => {
    return await this.codeListService.all.perform();
  });

  @action
  setVariableLabel(variable: Variable, event: InputEvent) {
    const newLabel = (event.target as HTMLInputElement).value;
    variable.label = newLabel;
  }

  @action
  toggleVariableRequired(variable: Variable) {
    variable.required = !variable.required;
  }

  @action
  setVariableType(variable: Variable, selectedType: VariableType) {
    const oldType = variable.type as VariableType | undefined;
    const labelModified =
      oldType && variable.label !== this.labelForType(oldType);
    variable.type = selectedType;

    if (!labelModified) {
      variable.label = this.labelForType(selectedType);
    }

    if (variable.type === 'codelist' && this.codelists.value?.length) {
      const codelistDefaultValue = this.codelists.value?.[0];
      this.updateCodelist(variable, codelistDefaultValue);
    }
  }

  @action
  updateCodelist(variable: Variable, codeList?: CodeList) {
    variable.set('codeList', codeList);
  }
}
