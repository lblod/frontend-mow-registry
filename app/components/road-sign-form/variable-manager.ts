import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import Variable from 'mow-registry/models/variable';
import IntlService from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import type CodelistsService from 'mow-registry/services/codelists';
import type CodeList from 'mow-registry/models/code-list';

interface Signature {
  Args: {
    roadSignConcept: RoadSignConcept;
    addVariable: () => void;
    removeVariable: (variableToRemove: Variable) => void;
  };
}

export type InputType = {
  value: string;
  label: string;
};

export default class VariableManager extends Component<Signature> {
  @service declare store: Store;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;
  @tracked codeLists?: CodeList[];

  variableTypes: Array<InputType>;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.variableTypes = [
      {
        value: 'text',
        label: this.intl.t('utility.template-variables.text'),
      },
      {
        value: 'number',
        label: this.intl.t('utility.template-variables.number'),
      },
      {
        value: 'date',
        label: this.intl.t('utility.template-variables.date'),
      },
      {
        value: 'location',
        label: this.intl.t('utility.template-variables.location'),
      },
      {
        value: 'codelist',
        label: this.intl.t('utility.template-variables.codelist'),
      },
    ];
    this.fetchCodeLists();
  }

  @action
  async fetchCodeLists() {
    try {
      this.codeLists = await this.codeListService.all.perform();
    } catch (error) {
      console.error('Error fetching code lists:', error);
    }
  }

  @action
  setVariableLabel(variable: Variable, event: InputEvent) {
    const newLabel = (event.target as HTMLInputElement).value;
    variable.set('label', newLabel);
  }

  @action
  setVariableRequired(variable: Variable) {
    variable.set('required', !variable.required);
  }

  @action
  async setVariableType(variable: Variable, selectedType: InputType) {
    if (variable.type === 'codelist') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = this.codeLists[0];
    }
    variable.set('type', selectedType.value);
    variable.set('label', selectedType.label);
  }

  @action
  async updateCodelist(variable: Variable, codeList: CodeList) {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.codeList = codeList;
  }
}
