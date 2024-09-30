import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import Variable from 'mow-registry/models/variable';
import { TrackedArray } from 'tracked-built-ins';
import IntlService from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Args: {
    roadSignConcept: RoadSignConcept;
    addVariable: () => void;
    removeVariable: (variableToRemove: Variable) => void;
  };
}

export default class VariableManager extends Component<Signature> {
  @service declare store: Store;
  @service declare intl: IntlService;

  @tracked selectedValue?: string;
  @tracked selectedType?: { value: string; label: string };

  variableTypes: TrackedArray<{ value: string; label: string }>;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.variableTypes = new TrackedArray([
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
    ]);
  }

  @action
  setVariableValue(event: InputEvent) {
    this.selectedValue = (event.target as HTMLInputElement).value;
  }

  @action
  setVariableType(selectedType: { value: string; label: string }) {
    this.selectedType = selectedType;
  }

  @action
  async addVariable() {
    if (this.selectedType && this.selectedValue) {
      const newVariable = this.store.createRecord<Variable>('variable', {
        value: this.selectedValue,
        type: this.selectedType.value,
        label: this.selectedType.label,
      });
      console.log(
        `created variable with value ${this.selectedValue} and type ${this.selectedType.value}`,
      );

      const variables = await this.args.roadSignConcept.variables;
      variables.push(newVariable);
      await newVariable.save();
      await this.args.roadSignConcept.save();
    }
  }

  @action
  async removeVariable(variableToBeRemoved: Variable) {
    const variables = await this.args.roadSignConcept.variables;

    const updatedVariables = variables.filter(
      (variable) => variable !== variableToBeRemoved,
    );
    this.args.roadSignConcept.set('variables', updatedVariables);
    await variableToBeRemoved.destroyRecord();
  }
}
