import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import type { DIMENSIONS, Shape } from 'mow-registry/utils/shapes';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import type TribontShape from 'mow-registry/models/tribont-shape';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';
import t from 'ember-intl/helpers/t';

interface Signature {
  Args: {
    modalOpen: boolean;
    closeModal: () => void;
    shapeToEdit: Shape;
    dimensionsToShow: {
      label: string;
      value: string;
    }[];
    convertToNewDefaultShape: boolean;
    toggleDefaultShape: () => void;
    trafficSignal: TrafficSignalConcept;
    defaultShape: Shape | undefined;
  };
}

export default class EditShapeModal extends Component<Signature> {
  @service declare store: Store;
  getError(shape: Shape, dimension: string) {
    if (!shape[dimension as keyof typeof DIMENSIONS]) return undefined;
    return Boolean(
      shape[dimension as keyof typeof DIMENSIONS]?.dimension.error,
    );
  }
  getRawValue(shape: Shape, dimension: string) {
    if (!shape[dimension as keyof typeof DIMENSIONS]) return undefined;
    return shape[dimension as keyof typeof DIMENSIONS]?.value;
  }
  setShapeValue = (shape: Shape, dimension: string, event: Event) => {
    const numberValue = Number((event.target as HTMLInputElement).value);
    const shapeDimension = shape[dimension as keyof typeof DIMENSIONS];
    if (shapeDimension) {
      shapeDimension.value = numberValue;
    }
  };
  saveShape = async () => {
    const saved = await this.args.shapeToEdit?.validateAndsave(this.store);
    if (saved) {
      const shapes = await this.args.trafficSignal.shapes;
      const shape = this.args.shapeToEdit?.shape as TribontShape;
      this.args.trafficSignal.set('shapes', [...shapes, shape]);
      if (this.args.convertToNewDefaultShape) {
        this.args.trafficSignal.set('defaultShape', shape);
      } else if (this.args.shapeToEdit?.id === this.args.defaultShape?.id) {
        this.args.trafficSignal.set('defaultShape', undefined);
      }
      await this.store.request(saveRecord(this.args.trafficSignal));
      await this.args.closeModal();
    }
  };
  <template>
    <AuModal @modalOpen={{@modalOpen}} @closeModal={{@closeModal}}>
      <:title>
        {{#if @shapeToEdit.shape.isNew}}
          {{t 'utility.add-shape'}}
        {{else}}
          {{t 'shape-manager.edit-modal-title'}}
        {{/if}}
      </:title>
      <:body>
        {{#each @dimensionsToShow as |dimension|}}
          <AuLabel
            @required={{true}}
            @requiredLabel={{t 'utility.required'}}
            @error={{this.getError @shapeToEdit dimension.value}}
          >{{dimension.label}}
          </AuLabel>
          <AuInput
            @width='block'
            value={{this.getRawValue @shapeToEdit dimension.value}}
            @error={{this.getError @shapeToEdit dimension.value}}
            {{on 'input' (fn this.setShapeValue @shapeToEdit dimension.value)}}
          />
        {{/each}}
        <AuLabel>{{t 'road-sign-concept.attr.default-shape'}}
        </AuLabel>
        <AuCheckbox
          @checked={{@convertToNewDefaultShape}}
          @onChange={{@toggleDefaultShape}}
        >
          {{t 'road-sign-concept.attr.default-shape'}}
        </AuCheckbox>
      </:body>
      <:footer>
        <AuButton {{on 'click' this.saveShape}}>
          {{t 'utility.save'}}
        </AuButton>
        <AuButton @skin='secondary' {{on 'click' @closeModal}}>
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
  </template>
}
