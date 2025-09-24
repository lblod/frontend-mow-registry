import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
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
import type IntlService from 'ember-intl/services/intl';
import { sortOnDimension } from 'mow-registry/utils/shapes/sorting';
import generateMeta from 'mow-registry/utils/generate-meta';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import humanFriendlyDate from 'mow-registry/helpers/human-friendly-date';
import { findAll, query, saveRecord } from '@warp-drive/legacy/compat/builders';

interface Signature {
  Args: {
    trafficSignal: TrafficSignalConcept;
  };
}

export default class ShapeManager extends Component<Signature> {
  @service declare store: Store;
  @service declare intl: IntlService;
  @tracked cardEditing = false;
  @tracked shapeChange?: ShapeClassification = undefined;
  @tracked unitChange?: Unit = undefined;

  shapeClassificationsPromise: Promise<ShapeClassification[]>;
  unitsPromise: Promise<Unit[]>;
  shapeToDelete?: Shape;
  @tracked isDeleteConfirmationOpen = false;
  @tracked isShapeChangeConfirmationOpen = false;

  @tracked shapeToEdit?: Shape;
  @tracked isEditShapeModalOpen = false;
  @tracked pageNumber = 0;
  pageSize = 20;
  @tracked sort?: string = 'created-on';
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
    const classificationUri = this.firstShape.value
      ?.get('classification')
      ?.get('uri');
    if (!classificationUri) return undefined;
    return SHAPES[classificationUri as keyof typeof SHAPES];
  }

  async fetchShapeClassifications() {
    const classifications = await this.store
      .request(
        findAll<ShapeClassification>('tribont-shape-classification-code'),
      )
      .then((res) => res.content);

    return classifications;
  }

  async fetchUnits() {
    const units = await this.store
      .request(findAll<Unit>('unit'))
      .then((res) => res.content);

    return units;
  }

  async fetchQuantityKind() {
    const quantityKind = await this.store
      .request(findAll<QuantityKind>('quantity-kind'))
      .then((res) => res.content);

    return quantityKind;
  }

  get defaultShapeClassification() {
    return this.firstShape.value?.get('classification').get('label');
  }
  defaultShape = trackedFunction(this, async () => {
    const defaultShape = (await this.args.trafficSignal
      .defaultShape) as TribontShape;
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const shapeConverted = await convertToShape(defaultShape);
    return shapeConverted;
  });
  firstShape = trackedFunction(this, async () => {
    const firstShape = (await this.args.trafficSignal.shapes)[0];
    return firstShape;
  });
  shapesConverted = trackedFunction(this, async () => {
    const number = this.pageNumber;
    const size = this.pageSize;
    const sort = this.sort;
    const trafficSignalId = this.args.trafficSignal.id;

    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const shapesConverted: Shape[] = [];
    let shapes: TribontShape[] = [];
    if (sort === 'created-on' || sort === '-created-on') {
      shapes = await this.store
        .request(
          query<TribontShape>('tribont-shape', {
            'filter[trafficSignalConcept][:id:]': this.args.trafficSignal.id,
            page: {
              number: number,
              size: size,
            },
            sort: sort,
          }),
        )
        .then((res) => res.content);
    } else {
      const shapesSorted = await sortOnDimension(
        sort,
        number,
        size,
        trafficSignalId as string,
      );
      const shapesQuery = await this.store
        .request(
          query<TribontShape>('tribont-shape', {
            'filter[:id:]': shapesSorted.ids.join(','),
          }),
        )
        .then((res) => res.content);
      shapes = [...shapesQuery];
      shapes.sort(
        (a, b) =>
          shapesSorted.ids.findIndex((id) => id === b.id) -
          shapesSorted.ids.findIndex((id) => id === a.id),
      );
      // @ts-expect-error We know that an array don't have a meta property but we need it for the table to work
      shapesConverted.meta = generateMeta(
        { page: number, size: size },
        shapesSorted.count,
      );
    }
    for (const shape of shapes) {
      const shapeConverted = await convertToShape(shape);
      if (shapeConverted) {
        shapesConverted.push(shapeConverted);
      }
    }

    return shapesConverted;
  });

  get defaultShapeString() {
    return this.defaultShape.value?.toString(this.intl);
  }

  get defaultMeasureUnit() {
    const shapesConverted = this.shapesConverted.value;
    if (!shapesConverted) return undefined;
    return shapesConverted[0]?.unitMeasure;
  }

  get dimensionsToShow() {
    return this.shapeClass?.headers(this.intl);
  }

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
        await shape?.convertToNewUnit(this.unitChange, this.store);
      }
    }
    this.cardEditing = false;
  };

  closeShapeChangeConfirmation = () => {
    this.isShapeChangeConfirmationOpen = false;
  };

  changeShape = async () => {
    let shapes = [...(await this.args.trafficSignal.shapes)];
    for (const shape of shapes) {
      await shape.destroyWithRelations();
    }
    const shapeClass = SHAPES[this.shapeChange?.uri as keyof typeof SHAPES];
    const shape = await shapeClass.createShape(
      this.selectedUnit as Unit,
      this.store,
      this.args.trafficSignal,
    );
    await shape.validateAndsave(this.store);
    this.args.trafficSignal.set('defaultShape', undefined);
    this.args.trafficSignal.set('shapes', [shape.shape]);
    await this.store.request(saveRecord(this.args.trafficSignal));
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

  getError(shape: Shape, dimension: keyof typeof DIMENSIONS) {
    if (!shape[dimension]) return undefined;
    return shape[dimension].dimension.error;
  }

  setShapeClassifications = (classification: ShapeClassification) => {
    this.shapeChange = classification;
  };
  setUnit = (unit: Unit) => {
    this.unitChange = unit;
  };

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
    await this.store.request(saveRecord(this.args.trafficSignal));
    await shape.remove(this.store);
    this.closeDeleteConfirmation();
  };

  startEditShapeFlow = (shape: Shape) => {
    this.shapeToEdit = shape;
    this.isEditShapeModalOpen = true;
  };

  closeEditShapeModal = async () => {
    await this.shapeToEdit?.reset();
    this.shapeToEdit = undefined;
    this.isEditShapeModalOpen = false;
  };
  saveShape = async () => {
    const saved = await this.shapeToEdit?.validateAndsave(this.store);
    if (saved) {
      await this.store.request(saveRecord(this.args.trafficSignal));
      await this.closeEditShapeModal();
    }
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
      this.args.trafficSignal,
    );
    if (shape) {
      this.startEditShapeFlow(shape);
    }
  };
  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
  };
  onSortChange = (newSort: string) => {
    this.sort = newSort;
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
      @noDataMessage={{t 'shape-manager.no-data'}}
      @page={{this.pageNumber}}
      @pageSize={{this.pageSize}}
      @onPageChange={{this.onPageChange}}
      @onSortChange={{this.onSortChange}}
      @sort={{this.sort}}
    >
      <:menu>
        <div class='au-u-flex au-u-flex--end'>
          <AuButton
            @skin='secondary'
            @icon='plus'
            @disabled={{not this.defaultShapeClassification}}
            title={{if
              this.defaultShapeClassification
              ''
              (t 'shape-manager.disabled-add-new-button-title')
            }}
            {{on 'click' this.addNewShape}}
            class='au-u-margin-small'
          >
            {{t 'utility.add-shape'}}
          </AuButton>
        </div>
      </:menu>
      <:header as |header|>
        {{#each this.dimensionsToShow as |dimension|}}
          <header.Sortable
            @field={{dimension.value}}
            @label={{dimension.label}}
          />
        {{/each}}
        <th>{{t 'road-sign-concept.attr.default-shape'}}</th>
        <header.Sortable @field='createdOn' @label={{t 'utility.created-on'}} />
        <th></th>
      </:header>
      <:body as |shape|>
        {{#each this.dimensionsToShow as |dimension|}}
          <td>{{this.getStringValue shape dimension.value}}</td>
        {{/each}}
        <td>
          {{#if (eq this.defaultShape.value.id shape.shape.id)}}
            <AuIcon @icon='check' @size='large' />
          {{/if}}
        </td>
        <td>
          {{humanFriendlyDate shape.shape.createdOn}}
        </td>
        <td>
          <AuButton
            @skin='naked'
            @icon='pencil'
            {{on 'click' (fn this.startEditShapeFlow shape)}}
          />
          <AuButton
            @skin='naked'
            @icon='trash'
            {{on 'click' (fn this.startDeleteShapeFlow shape)}}
          /></td>
      </:body>
    </ReactiveTable>
    <AuModal
      @modalOpen={{this.isEditShapeModalOpen}}
      @closeModal={{this.closeEditShapeModal}}
    >
      <:title>
        {{#if this.shapeToEdit.shape.isNew}}
          {{t 'utility.add-shape'}}
        {{else}}
          {{t 'shape-manager.edit-modal-title'}}
        {{/if}}
      </:title>
      <:body>
        {{#each this.dimensionsToShow as |dimension|}}
          <AuLabel
            @required={{true}}
            @requiredLabel={{t 'utility.required'}}
            @error={{this.getError this.shapeToEdit dimension.value}}
          >{{dimension.label}}
          </AuLabel>
          <AuInput
            @width='block'
            value={{this.getRawValue this.shapeToEdit dimension.value}}
            @error={{this.getError this.shapeToEdit dimension.value}}
            {{on
              'input'
              (fn this.setShapeValue this.shapeToEdit dimension.value)
            }}
          />
        {{/each}}
        <AuLabel>{{t 'road-sign-concept.attr.default-shape'}}
        </AuLabel>
        <AuCheckbox
          @checked={{eq this.defaultShape.value.id this.shapeToEdit.shape.id}}
          @onChange={{fn this.toggleDefaultShape this.shapeToEdit}}
        >
          {{t 'road-sign-concept.attr.default-shape'}}
        </AuCheckbox>
      </:body>
      <:footer>
        <AuButton {{on 'click' this.saveShape}}>
          {{t 'utility.save'}}
        </AuButton>
        <AuButton @skin='secondary' {{on 'click' this.closeEditShapeModal}}>
          {{t 'utility.cancel'}}
        </AuButton>
      </:footer>
    </AuModal>
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
          {{#if (eq this.shapesConverted.value.length 1)}}
            {{t 'shape-manager.delete-last-shape'}}
          {{/if}}
        </p>
      </:body>
      <:footer>
        <AuButton @alert={{true}} {{on 'click' this.removeShape}}>
          {{t 'shape-manager.delete'}}
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
          {{t 'shape-manager.shape-change.body'}}
        </p>
      </:body>
      <:footer>
        <AuButton @alert={{true}} {{on 'click' this.changeShape}}>
          {{t 'shape-manager.shape-change.button'}}
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
