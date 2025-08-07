import Controller from '@ember/controller';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import type { InputType } from 'mow-registry/components/traffic-measure';
import type CodeList from 'mow-registry/models/code-list';
import Variable from 'mow-registry/models/variable';
import type CodelistsService from 'mow-registry/services/codelists';
export default class RoadSignConceptsRoadSignConceptSubSignsController extends Controller {
  @service declare intl: IntlService;
  variableTypes: Array<InputType>;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare store: Store;
  @tracked codeLists?: CodeList[];
  @tracked editMode = false;

  constructor(owner: Owner | undefined) {
    super(owner);

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

  fetchCodeLists = () => {
    this.codeListService.all
      .perform()
      .then((codelists) => (this.codeLists = codelists))
      .catch((error) => console.error('Error fetching code lists:', error));
  };

  toggleEditing = async () => {
    if (this.editMode) {
      console.log(this.model.variables);
      let isValid = true;
      for (let variable of this.model.variables) {
        if (variable.hasDirtyAttributes) {
          const variableValid = await variable.validate();
          if (!variableValid) isValid = false;
        }
      }
      if (!isValid) return;
      for (let variable of this.model.variables) {
        if (variable.hasDirtyAttributes) {
          await variable.save();
        }
      }
    }
    this.editMode = !this.editMode;
  };

  setVariableLabel = (variable: Variable, event: InputEvent) => {
    const newLabel = (event.target as HTMLInputElement).value;
    variable.set('label', newLabel);
  };

  setVariableRequired = (variable: Variable) => {
    variable.set('required', !variable.required);
  };

  setVariableType = (variable: Variable, selectedType: InputType) => {
    const actualType = this.variableTypes.find(
      (type) => type.value === variable.type,
    );
    const labelModified = actualType && actualType.label !== variable.label;
    if (variable.type === 'codelist') {
      //@ts-expect-error currently the ts types don't allow direct assignment of relationships
      variable.codeList = this.codeLists[0];
    }
    variable.set('type', selectedType.value);
    if (!labelModified) {
      variable.set('label', selectedType.label);
    }
  };

  updateCodelist = (variable: Variable, codeList: CodeList) => {
    //@ts-expect-error currently the ts types don't allow direct assignment of relationships
    variable.codeList = codeList;
  };

  addVariable = async () => {
    const newVariable = this.store.createRecord<Variable>('variable', {});
    (await this.model.roadSignConcept.variables).push(newVariable);
  };
  reset() {
    this
  }
}
