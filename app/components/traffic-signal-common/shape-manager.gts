import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import Component from '@glimmer/component';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import ReactiveTable from 'mow-registry/components/reactive-table';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import PowerSelect from 'ember-power-select/components/power-select';
import { eq, not, and } from 'ember-truth-helpers';
import { trackedFunction } from 'reactiveweb/function';
import type ShapeClassification from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';
import { DIMENSIONS, type Shape } from 'mow-registry/utils/shapes';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import {
  convertToShape,
  shapeDimensionToText,
  SHAPES,
} from 'mow-registry/utils/shapes';
import type TribontShape from 'mow-registry/models/tribont-shape';
import { removeItem } from 'mow-registry/utils/array';

interface Signature {
  Args: {
    trafficSignal: TrafficSignalConcept;
  };
}

export default class ShapeManager extends Component<Signature> {
  @service declare store: Store;
  @tracked cardEditing = false;
  @tracked shapeChange?: ShapeClassification = undefined;
  @tracked unitChange?: Unit = undefined;
  @tracked editShapeId?: string = undefined;
  shapeClassificationsPromise: Promise<ShapeClassification[]>;
  unitsPromise: Promise<Unit[]>;
  shapeToDelete?: Shape;
  @tracked isDeleteConfirmationOpen = false;
  @tracked isShapeChangeConfirmationOpen = false;
  constructor(
    owner: Owner | undefined,
    args: {
      trafficSignal: TrafficSignalConcept;
    },
  ) {
    super(owner, args);
    this.shapeClassificationsPromise = this.fetchShapeClassifications();
    this.unitsPromise = this.fetchUnits();
  }

  get selectedShape() {
    return this.shapeChange ?? this.firstShape.value?.get('classification');
  }

  get selectedUnit() {
    return this.unitChange ?? this.defaultMeasureUnit;
  }

  get shapeClass() {
    const classificationId = this.firstShape.value
      ?.get('classification')
      ?.get('id');
    if (!classificationId) return undefined;
    return SHAPES[classificationId as keyof typeof SHAPES];
  }

  async fetchShapeClassifications() {
    const classifications = await this.store.findAll<ShapeClassification>(
      'tribont-shape-classification-code',
    );

    return classifications;
  }

  async fetchUnits() {
    const units = await this.store.findAll<Unit>('unit');

    return units;
  }

  async fetchQuantityKind() {
    const quantityKind =
      await this.store.findAll<QuantityKind>('quantity-kind');

    return quantityKind;
  }

  get defaultShapeClassification() {
    return this.firstShape.value?.get('classification').get('label');
  }
  defaultShape = trackedFunction(this, async () => {
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const shapeConverted = await convertToShape(
      (await this.args.trafficSignal.defaultShape) as TribontShape,
    );
    return shapeConverted;
  });
  firstShape = trackedFunction(this, async () => {
    const firstShape = (await this.args.trafficSignal.shapes)[0];
    return firstShape;
  });
  shapesConverted = trackedFunction(this, async () => {
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const shapesConverted = [];
    const shapes = await this.args.trafficSignal.shapes;
    for (const shape of shapes) {
      const shapeConverted = await convertToShape(shape);
      if (shapeConverted) {
        shapesConverted.push(shapeConverted);
      }
    }
    return shapesConverted;
  });

  get defaultShapeString() {
    return this.defaultShape.value?.toString();
  }

  get defaultMeasureUnit() {
    const shapesConverted = this.shapesConverted.value;
    if (!shapesConverted) return undefined;
    return shapesConverted[0]?.unitMeasure;
  }

  get dimensionsToShow() {
    return this.shapeClass?.headers();
  }
  toggleEditing() {}

  editCard = () => {
    this.cardEditing = true;
  };

  saveCard = async () => {
    const defaultShape = await this.args.trafficSignal.defaultShape;
    if (
      this.shapeChange &&
      this.shapeChange.id !== defaultShape?.classification.id
    ) {
      //Show alert
      this.isShapeChangeConfirmationOpen = true;
    } else if (
      this.unitChange &&
      this.unitChange.id !== this.defaultMeasureUnit?.id &&
      this.shapesConverted.value
    ) {
      for (const shape of this.shapesConverted.value) {
        await shape?.convertToNewUnit(this.unitChange);
      }
    }
    await this.shapesConverted.retry();
    await this.defaultShape.retry();
    this.cardEditing = false;
  };

  closeShapeChangeConfirmation = () => {
    this.isShapeChangeConfirmationOpen = false;
  };

  changeShape = async () => {
    const shapes = await this.args.trafficSignal.shapes;
    for (const shape of shapes) {
      await this.removeTribontShape(shape);
    }
    const shapeClass = SHAPES[this.shapeChange?.id as keyof typeof SHAPES];
    const shape = await shapeClass.createShape(
      this.selectedUnit as Unit,
      this.store,
    );
    this.args.trafficSignal.set('defaultShape', undefined);
    this.args.trafficSignal.set('shapes', [shape.shape]);
    await this.args.trafficSignal.save();
    await this.shapesConverted.retry();
    await this.defaultShape.retry();
    this.closeShapeChangeConfirmation();
  };

  cancelCard = () => {
    this.cardEditing = false;
    this.unitChange = undefined;
    this.shapeChange = undefined;
  };

  getStringValue(shape: Shape, dimension: keyof typeof DIMENSIONS) {
    if (!shape[dimension]) return '';
    return shapeDimensionToText(shape[dimension]);
  }

  getRawValue(shape: Shape, dimension: keyof typeof DIMENSIONS) {
    if (!shape[dimension]) return '';
    return shape[dimension].value;
  }

  setShapeClassifications = (classification: ShapeClassification) => {
    this.shapeChange = classification;
  };
  setUnit = (unit: Unit) => {
    this.unitChange = unit;
  };

  async removeTribontShape(shape: TribontShape) {
    const dimensions = await shape.dimensions;
    for (let dimension of dimensions) {
      dimension.deleteRecord();
      await dimension.save();
    }
    shape.deleteRecord();
    await shape.save();
  }

  startDeleteShapeFlow = (shape: Shape) => {
    this.shapeToDelete = shape;
    this.isDeleteConfirmationOpen = true;
  };

  closeDeleteConfirmation = () => {
    this.shapeToDelete = undefined;
    this.isDeleteConfirmationOpen = false;
  };

  removeShape = async () => {
    const shape = this.shapeToDelete;
    if (!shape) return;
    const shapes = await this.args.trafficSignal.shapes;
    removeItem(shapes, shape.shape);
    await this.args.trafficSignal.save();
    await shape.remove();
    await this.shapesConverted.retry();
    await this.defaultShape.retry();
    this.closeDeleteConfirmation();
  };

  editShape = (shape: Shape) => {
    if (!shape.id) return;
    this.editShapeId = shape.id;
  };
  saveShape = async (shape: Shape) => {
    await shape.save();
    await this.args.trafficSignal.save();
    this.editShapeId = undefined;
    await this.shapesConverted.retry();
    await this.defaultShape.retry();
  };
  resetShape = async (shape: Shape) => {
    await shape.reset();
    this.editShapeId = undefined;
  };

  setShapeValue = (
    shape: Shape,
    dimension: keyof typeof DIMENSIONS,
    event: Event,
  ) => {
    const numberValue = Number((event.target as HTMLInputElement).value);
    const shapeDimension = shape[dimension];
    if (shapeDimension) {
      shapeDimension.dimension.set('value', numberValue);
      shapeDimension.value = numberValue;
    }
  };
  toggleDefaultShape = async (shape: Shape) => {
    const currentDefault = await this.args.trafficSignal.defaultShape;
    if (currentDefault && currentDefault.id === shape.id) {
      this.args.trafficSignal.set('defaultShape', null);
    } else {
      this.args.trafficSignal.set('defaultShape', shape.shape);
    }
  };
  addNewShape = async () => {
    const shape = await this.shapeClass?.createShape(
      this.selectedUnit as Unit,
      this.store,
    );
    const oldShapes = await this.args.trafficSignal.shapes;
    this.args.trafficSignal.set('shapes', [...oldShapes, shape?.shape]);
    await this.args.trafficSignal.save();
    this.shapesConverted.retry();
  };
  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <h2 class='shapes-title au-u-margin-left au-u-margin-top'>{{t
        'road-sign-concept.attr.shape'
      }}</h2>

    <dl class='shapes-card au-u-margin au-u-margin-top-none'>
      <div class='shapes-buttons'>
        {{#if this.cardEditing}}
          <AuButton
            {{on 'click' this.saveCard}}
            @disabled={{not (and this.selectedUnit this.selectedShape)}}
            @skin='link'
          >{{t 'utility.save'}}</AuButton>
          <AuButton {{on 'click' this.cancelCard}} @skin='link-secondary'>{{t
              'utility.cancel'
            }}</AuButton>
        {{else}}
          <AuButton @icon='pencil' @skin='naked' {{on 'click' this.editCard}} />
        {{/if}}
      </div>
      <div class='au-u-flex au-u-margin-small'>
        <div class='shape-datapoint'>
          <dt>{{t 'road-sign-concept.attr.shape'}}</dt>
          <dd>
            {{#if this.cardEditing}}
              <PowerSelect
                @allowClear={{false}}
                @searchEnabled={{false}}
                @searchField='label'
                @loadingMessage={{t 'utility.loading'}}
                @options={{this.shapeClassificationsPromise}}
                @selected={{this.selectedShape}}
                @onChange={{this.setShapeClassifications}}
                @triggerId='shapeConcepts'
                as |shapeClassification|
              >
                {{shapeClassification.label}}
              </PowerSelect>
            {{else}}
              {{this.firstShape.value.classification.label}}
            {{/if}}
          </dd>
        </div>
        <div class='shape-datapoint'>
          <dt>{{t 'road-sign-concept.attr.dimension-unit'}}</dt>
          <dd>
            {{#if this.cardEditing}}
              <PowerSelect
                @allowClear={{false}}
                @searchEnabled={{false}}
                @searchField='label'
                @loadingMessage={{t 'utility.loading'}}
                @options={{this.unitsPromise}}
                @selected={{this.selectedUnit}}
                @onChange={{this.setUnit}}
                @triggerId='shapeConcepts'
                as |unit|
              >
                {{unit.symbol}}
              </PowerSelect>
            {{else}}
              {{this.defaultMeasureUnit.symbol}}
            {{/if}}
          </dd>
        </div>
      </div>
      <div class='au-u-margin-small'>
        <dt>{{t 'road-sign-concept.attr.default-shape'}}</dt>
        <dd>
          {{#if this.cardEditing}}
            <AuInput value={{this.defaultShapeString}} @disabled='true' />
          {{else}}
            {{this.defaultShapeString}}
          {{/if}}
        </dd>
      </div>
    </dl>
    <ReactiveTable
      @content={{this.shapesConverted.value}}
      @isLoading={{this.isLoading}}
      @noDataMessage={{t 'road-sign-concept.crud.no-data'}}
    >
      <:menu>
        <div class='au-u-flex au-u-flex--end'>
          <AuButton
            @skin='secondary'
            @width='block'
            @icon='plus'
            @disabled={{not this.defaultShapeClassification}}
            {{on 'click' this.addNewShape}}
          >
            {{t 'utility.add-shape'}}
          </AuButton>
        </div>
      </:menu>
      <:header>
        {{#each this.dimensionsToShow as |dimension|}}
          <th>{{dimension.label}}</th>
        {{/each}}
        <th>{{t 'road-sign-concept.attr.default-shape'}}</th>
        <th></th>
      </:header>
      <:body as |shape|>
        {{#each this.dimensionsToShow as |dimension|}}
          {{#if (eq shape.shape.id this.editShapeId)}}
            <td>
              <AuInput
                @width='block'
                id='label'
                value={{this.getRawValue shape dimension.value}}
                {{on 'input' (fn this.setShapeValue shape dimension.value)}}
              />
            </td>
          {{else}}
            <td>{{this.getStringValue shape dimension.value}}</td>
          {{/if}}
        {{/each}}
        {{#if (eq shape.shape.id this.editShapeId)}}
          <td>
            <AuCheckbox
              @checked={{eq this.defaultShape.value.id shape.shape.id}}
              @onChange={{fn this.toggleDefaultShape shape}}
            >
              {{t 'road-sign-concept.attr.default-shape'}}
            </AuCheckbox>
          </td>
        {{else}}
          <td>{{#if (eq this.defaultShape.value.id shape.shape.id)}}
              <AuIcon @icon='check' @size='large' />
            {{/if}}</td>
        {{/if}}

        {{#if (eq shape.shape.id this.editShapeId)}}
          <td>
            <AuButton @skin='link' {{on 'click' (fn this.saveShape shape)}}>{{t
                'utility.save'
              }}</AuButton>
            <AuButton
              @skin='link-secondary'
              {{on 'click' (fn this.resetShape shape)}}
            >{{t 'utility.cancel'}}</AuButton></td>
        {{else}}
          <td>
            <AuButton
              @skin='naked'
              @icon='pencil'
              {{on 'click' (fn this.editShape shape)}}
            />
            <AuButton
              @skin='naked'
              @icon='trash'
              {{on 'click' (fn this.startDeleteShapeFlow shape)}}
            /></td>
        {{/if}}
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
        <AuButton @alert={{true}} {{on 'click' this.removeShape}}>
          {{t 'shapes-manager.crud.delete'}}
        </AuButton>
        <AuButton @skin='secondary' {{on 'click' this.closeDeleteConfirmation}}>
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
    <AuModal
      @modalOpen={{this.isShapeChangeConfirmationOpen}}
      @closeModal={{this.closeShapeChangeConfirmation}}
    >
      <:title>
        {{t 'utility.confirmation.title'}}
      </:title>
      <:body>
        <p>
          {{t 'shapes-manager.shape-change.body'}}
        </p>
      </:body>
      <:footer>
        <AuButton @alert={{true}} {{on 'click' this.changeShape}}>
          {{t 'shapes-manager.shape-change.button'}}
        </AuButton>
        <AuButton
          @skin='secondary'
          {{on 'click' this.closeShapeChangeConfirmation}}
        >
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
  </template>
}
