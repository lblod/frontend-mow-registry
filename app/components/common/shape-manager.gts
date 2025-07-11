import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn, get } from '@ember/helper';
import Store from 'mow-registry/services/store';
import t from 'ember-intl/helpers/t';
// @ts-expect-error need to move to truth-helpers v4
import eq from 'ember-truth-helpers/helpers/eq';
// @ts-expect-error need to move to truth-helpers v4
import lte from 'ember-truth-helpers/helpers/lte';
// @ts-expect-error need to move to truth-helpers v4
import not from 'ember-truth-helpers/helpers/not';
// @ts-expect-error need to move to truth-helpers v4
import or from 'ember-truth-helpers/helpers/or';
// @ts-expect-error no types
import promiseAwait from 'ember-promise-helpers/helpers/await';
import PowerSelect from 'ember-power-select/components/power-select';
import AuFieldset from '@appuniversum/ember-appuniversum/components/au-fieldset';
import AuCard from '@appuniversum/ember-appuniversum/components/au-card';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import Dimension from 'mow-registry/models/dimension';
import type QuantityKind from 'mow-registry/models/quantity-kind';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type TribontShape from 'mow-registry/models/tribont-shape';
import type ShapeClassification from 'mow-registry/models/tribont-shape-classification-code';
import type Unit from 'mow-registry/models/unit';
import { isSome } from 'mow-registry/utils/option';
import ErrorMessage from 'mow-registry/components/error-message';
import sortByOrder from 'mow-registry/helpers/sort-by-order';
import type { AsyncBelongsTo } from '@warp-drive/legacy/model';

interface Signature {
  Args: {
    trafficSignalConcept: TrafficSignalConcept;
    shapes: TribontShape[];
    defaultShape?: TribontShape | AsyncBelongsTo<TribontShape>;
    addShape: () => void;
    toggleDefaultShape: (shape: TribontShape) => Promise<void>;
    removeShape: (shapeToRemove: TribontShape) => void;
    removeDimension: (
      shape: TribontShape,
      dimensionToRemove: Dimension,
    ) => void;
  };
}

export default class ShapeManager extends Component<Signature> {
  @service declare store: Store;
  @tracked units: Unit[] = [];
  unitsPromise: Promise<Unit[]>;
  shapeClassificationsPromise: Promise<ShapeClassification[]>;
  quantityKindsPromise: Promise<QuantityKind[]>;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.unitsPromise = this.fetchUnits();
    this.shapeClassificationsPromise = this.fetchShapeClassifications();
    this.quantityKindsPromise = this.fetchQuantityKinds();
    void this.ensureShapeData();
  }

  plusOne = (value: number) => {
    return value + 1;
  };

  get shouldPreventDeletion() {
    return this.args.shapes.length <= 1;
  }

  async ensureShapeData() {
    // Needed to work around the following error:
    // You attempted to update <RelatedCollection:tribont-shape>.length, but it had already been used previously in the same computation...
    await Promise.resolve();

    const shapes = this.args.shapes;

    if (shapes.length === 0) {
      const shape = this.store.createRecord<TribontShape>('tribont-shape', {
        dimensions: [this.store.createRecord<Dimension>('dimension', {})],
      });

      shapes.push(shape);
    }
  }

  async fetchUnits() {
    this.units = await this.store.findAll<Unit>('unit');

    return this.units;
  }

  async fetchShapeClassifications() {
    const classifications = await this.store.findAll<ShapeClassification>(
      'tribont-shape-classification-code',
    );

    return classifications;
  }

  fetchQuantityKinds() {
    return this.store.query<QuantityKind>('quantity-kind', {
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      include: 'units',
    });
  }

  addDimension = async (shape: TribontShape) => {
    (await shape.dimensions).push(
      this.store.createRecord<Dimension>('dimension', {}),
    );
  };

  setQuantityKind = async (dimension: Dimension, kind: QuantityKind) => {
    dimension.kind = kind;
    const newUnits = kind.units;
    const currentUnit = await dimension.unit;

    if (!currentUnit || !newUnits.includes(currentUnit)) {
      const defaultUnit = newUnits.find((unit) => unit.isDefaultUnit);
      dimension.set('unit', defaultUnit);
    }
  };

  setUnitType = (dimension: Dimension, unit: Unit) => {
    dimension.set('unit', unit);
  };

  setDimensionValue = (dimension: Dimension, event: Event) => {
    const newValue = (event.target as HTMLInputElement).valueAsNumber;
    dimension.value = !Number.isNaN(newValue) ? newValue : undefined;
  };

  <template>
    <AuFieldset as |f|>
      <f.legend
        @skin='6'
        @required={{true}}
        @requiredLabel={{t 'utility.required'}}
        @error={{isSome (get @trafficSignalConcept.error 'shapes')}}
      >
        {{t 'utility.shapes'}}
      </f.legend>
      <f.content class='au-u-1-1'>
        <div class='au-o-flow'>
          {{#each @shapes as |shape index|}}
            <AuCard as |c|>
              <c.header>
                <AuToolbar as |Group|>
                  <Group>
                    <AuHeading @level='1' @skin='5'>
                      {{t
                        'road-sign-concept.shapes.title'
                        index=(this.plusOne index)
                      }}
                    </AuHeading>
                  </Group>
                  <Group>
                    <AuButton
                      @skin='naked'
                      @disabled={{this.shouldPreventDeletion}}
                      @icon='bin'
                      @alert={{true}}
                      {{on 'click' (fn @removeShape shape)}}
                    >
                      {{t 'utility.delete'}}
                    </AuButton>
                  </Group>
                </AuToolbar>
              </c.header>
              <c.content>
                <AuFormRow @alignment='inline'>
                  <div
                    class='au-u-1-2
                      {{if
                        (get shape.error "classification")
                        "ember-power-select--error"
                      }}'
                  >
                    {{! @glint-expect-error need to move to PS 8 }}
                    <PowerSelect
                      @allowClear={{false}}
                      @searchEnabled={{false}}
                      @searchField='label'
                      @loadingMessage={{t 'utility.loading'}}
                      {{! @glint-expect-error need to move to PS 8 }}
                      @options={{this.shapeClassificationsPromise}}
                      @selected={{shape.classification}}
                      @onChange={{fn (mut shape.classification)}}
                      @triggerId='shapeConcepts'
                      as |shapeClassification|
                    >
                      {{shapeClassification.label}}
                    </PowerSelect>
                  </div>
                  <div class='au-u-1-2'>
                    <AuCheckbox
                      @checked={{eq shape.id @defaultShape.id}}
                      @onChange={{fn @toggleDefaultShape shape}}
                    >
                      {{t 'road-sign-concept.attr.default-shape'}}
                    </AuCheckbox>
                  </div>
                  <ErrorMessage @error={{get shape.error 'classification'}} />
                </AuFormRow>

                <AuTable>
                  <:title>{{t 'utility.dimensions'}}</:title>
                  <:header>
                    <tr>
                      <th id='dimension-kind-{{index}}'>
                        {{t 'road-sign-concept.dimension'}}
                      </th>
                      <th id='dimension-unit-{{index}}'>
                        {{t 'road-sign-concept.attr.unit'}}
                      </th>
                      <th id='dimension-value-{{index}}'>
                        {{t 'road-sign-concept.value'}}
                      </th>
                      <th>{{! delete }}</th>
                    </tr>
                  </:header>
                  <:body>
                    {{#let (promiseAwait shape.dimensions) as |dimensions|}}
                      {{#each dimensions as |dimension|}}
                        <tr>
                          <td>
                            <div
                              class={{if
                                dimension.error.kind
                                'ember-power-select--error'
                              }}
                            >
                              {{! @glint-expect-error need to move to PS 8 }}
                              <PowerSelect
                                @allowClear={{false}}
                                @searchEnabled={{false}}
                                @searchField='label'
                                @loadingMessage={{t 'utility.loading'}}
                                {{! @glint-expect-error need to move to PS 8 }}
                                @options={{this.quantityKindsPromise}}
                                @selected={{dimension.kind}}
                                @onChange={{fn this.setQuantityKind dimension}}
                                @triggerId='quantityKinds'
                                @ariaLabelledBy='dimension-kind-{{index}}'
                                as |qt|
                              >
                                {{qt.label}}
                              </PowerSelect>
                            </div>
                            <ErrorMessage @error={{dimension.error.kind}} />
                          </td>
                          <td>
                            <div
                              class={{if
                                dimension.error.unit
                                'ember-power-select--error'
                              }}
                            >
                              {{! @glint-expect-error need to move to PS 8 }}
                              <PowerSelect
                                @disabled={{not dimension.kind}}
                                @allowClear={{false}}
                                @searchEnabled={{false}}
                                @searchField='symbol'
                                @loadingMessage={{t 'utility.loading'}}
                                {{! @glint-expect-error need to move to PS 8 }}
                                @options={{if
                                  dimension.kind.units
                                  (sortByOrder dimension.kind.units)
                                }}
                                @selected={{dimension.unit}}
                                @onChange={{fn this.setUnitType dimension}}
                                @triggerId='unitType'
                                @ariaLabelledBy='dimension-unit-{{index}}'
                                as |u|
                              >
                                {{u.symbol}}
                              </PowerSelect>
                            </div>
                            <ErrorMessage @error={{dimension.error.unit}} />
                          </td>
                          <td>
                            <AuInput
                              @error={{dimension.error.value}}
                              @disabled={{or
                                (not dimension.unit)
                                (not dimension.kind)
                              }}
                              @width='block'
                              type='number'
                              required='required'
                              value={{dimension.value}}
                              aria-labelledby='dimension-value-{{index}}'
                              {{on
                                'input'
                                (fn this.setDimensionValue dimension)
                              }}
                            />
                            <ErrorMessage @error={{dimension.error.value}} />
                          </td>
                          <td>
                            <AuButton
                              @disabled={{lte dimensions.length 1}}
                              @skin='naked'
                              @alert={{true}}
                              {{on
                                'click'
                                (fn @removeDimension shape dimension)
                              }}
                            >
                              {{t 'utility.delete'}}
                            </AuButton>
                          </td>
                        </tr>
                      {{/each}}
                    {{/let}}
                  </:body>
                </AuTable>

                <AuButton
                  @skin='secondary'
                  @icon='add'
                  @width='block'
                  {{on 'click' (fn this.addDimension shape)}}
                >
                  {{t 'road-sign-concept.add-dimension'}}
                </AuButton>
              </c.content>
            </AuCard>
          {{/each}}
          <AuButton
            @skin='secondary'
            @icon='add'
            @width='block'
            {{on 'click' @addShape}}
          >
            {{t 'road-sign-concept.add-shape'}}
          </AuButton>

          <ErrorMessage @error={{get @trafficSignalConcept.error 'shapes'}} />
        </div>
      </f.content>
    </AuFieldset>
  </template>
}
