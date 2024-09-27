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
    variables: Variable[];
    addVariable: () => void;
    removeVariable: (variableToRemove: Variable) => void;
  };
}

export default class VariableManager extends Component<Signature> {
  @service declare store: Store;
  @service declare intl: IntlService;

  @tracked variableValue = '';
  @tracked variableType = '';
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
    this.variableValue = (event.target as HTMLInputElement).value;
  }

  @action
  setVariableType(typeSelection: { value: string }) {
    this.variableType = typeSelection.value;
  }

  @action
  async addVariable() {
    const newVariable = this.store.createRecord<Variable>('variable', {
      value: this.variableValue,
      type: this.variableType,
    });

    const variables = await this.args.roadSignConcept.variables;
    console.log('variables', variables);
    variables.push(newVariable);
    await newVariable.save();
    await this.args.roadSignConcept.save();

    this.variableValue = '';
    this.variableType = '';
  }
}
