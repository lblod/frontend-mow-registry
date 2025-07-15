import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import Variable, { type VariableType } from 'mow-registry/models/variable';
import IntlService from 'ember-intl/services/intl';
import type CodelistsService from 'mow-registry/services/codelists';
import type CodeList from 'mow-registry/models/code-list';
import { trackedFunction } from 'reactiveweb/function';
import { labelForVariableType } from 'mow-registry/utils/variable';

interface Signature {
  Args: {
    variables: Variable[];
    addVariable: () => void;
    removeVariable: (variableToRemove: Variable) => void;
  };
}

type SignVariableType = Exclude<VariableType, 'instruction'>;

const SIGN_VARIABLE_TYPES: SignVariableType[] = [
  'text',
  'number',
  'date',
  'location',
  'codelist',
] as const;

export default class VariableManager extends Component<Signature> {
  @service declare store: Store;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;

  get variableTypes() {
    return SIGN_VARIABLE_TYPES;
  }

  labelForType = (variableType: SignVariableType) => {
    return labelForVariableType(this.intl, variableType);
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
  setVariableType(variable: Variable, selectedType: SignVariableType) {
    const oldType = variable.type as SignVariableType | undefined;
    const labelModified =
      oldType && variable.label !== this.labelForType(oldType);
    variable.type = selectedType satisfies VariableType;

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
