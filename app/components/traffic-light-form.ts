import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import ImageUploadHandlerComponent from './image-upload-handler';
import type RouterService from '@ember/routing/router-service';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import Store from 'mow-registry/services/store';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { ModifiableKeysOfType } from 'mow-registry/utils/type-utils';
import type Variable from 'mow-registry/models/variable';
import { removeItem } from 'mow-registry/utils/array';
import { validateVariables } from 'mow-registry/utils/validate-relations';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

type Args = {
  trafficLightConcept: TrafficLightConcept;
};

export default class TrafficLightFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked variablesToRemove: Variable[] = [];

  get isSaving() {
    return this.editTrafficLightConceptTask.isRunning;
  }

  @action
  async setTrafficLightConceptValue(
    attributeName: ModifiableKeysOfType<TrafficLightConcept, string>,
    event: InputEvent,
  ) {
    this.args.trafficLightConcept[attributeName] = (
      event.target as HTMLInputElement
    ).value;
    await this.args.trafficLightConcept.validateProperty(attributeName);
  }

  @action
  async setBooleanValue(
    attributeName: ModifiableKeysOfType<TrafficLightConcept, boolean>,
    value: boolean,
  ) {
    this.args.trafficLightConcept[attributeName] = value;
    await this.args.trafficLightConcept.validateProperty(attributeName);
  }
  @action
  async setTrafficLightDate(attribute: string, isoDate: string, date: Date) {
    if (date && attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    if (date) {
      this.args.trafficLightConcept.set(attribute, date);
    } else {
      this.args.trafficLightConcept.set(attribute, undefined);
    }
    await this.args.trafficLightConcept.validateProperty('startDate', {
      warnings: true,
    });
    await this.args.trafficLightConcept.validateProperty('endDate', {
      warnings: true,
    });
  }

  editTrafficLightConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    const isValid = await this.args.trafficLightConcept.validate();
    const areVariablesValid = await validateVariables(
      this.args.trafficLightConcept.variables,
    );
    if (isValid && areVariablesValid) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.trafficLightConcept.set('image', imageRecord); // image gets uploaded but not replaced

      await Promise.all(
        (await this.args.trafficLightConcept.variables).map(
          async (variable) => {
            await this.store.request(saveRecord(variable));
          },
        ),
      );

      await Promise.all(
        this.variablesToRemove.map((variable) => variable.destroyRecord()),
      );
      await this.store.request(saveRecord(this.args.trafficLightConcept));
      this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        this.args.trafficLightConcept.id,
      );
    }
  });

  @action
  setImage(model: TrafficSignalConcept, image: File) {
    super.setImage(model, image);
    void this.args.trafficLightConcept.validateProperty('image');
  }

  @action
  async addVariable() {
    const newVariable = this.store.createRecord<Variable>('variable', {});
    (await this.args.trafficLightConcept.variables).push(newVariable);
  }

  @action
  async removeVariable(variable: Variable) {
    const variables = await this.args.trafficLightConcept.variables;
    removeItem(variables, variable);
    this.variablesToRemove.push(variable);
  }

  willDestroy() {
    super.willDestroy();
    this.args.trafficLightConcept.reset();
  }
}
