import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn, get } from '@ember/helper';
import Store from 'mow-registry/services/store';
import t from 'ember-intl/helpers/t';
import { and, eq, lte, not, or } from 'ember-truth-helpers';
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
import { findAll, query } from '@warp-drive/legacy/compat/builders';

interface Signature {
  Args: {
    trafficSignalConcept: TrafficSignalConcept;
    shapes: TribontShape[];
    defaultShape?: TribontShape | AsyncBelongsTo<TribontShape>;
    addShape: () => Promise<TribontShape>;
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
  }

  plusOne = (value: number) => {
    return value + 1;
  };

  async fetchUnits() {
    this.units = await this.store
      .request(findAll<Unit>('unit'))
      .then((res) => res.content);

    return this.units;
  }

  async fetchShapeClassifications() {
    const classifications = await this.store
      .request(
        findAll<ShapeClassification>('tribont-shape-classification-code'),
      )
      .then((res) => res.content);

    return classifications;
  }

  fetchQuantityKinds() {
    return this.store
      .request(
        query<QuantityKind>('quantity-kind', {
          include: ['units'],
        }),
      )
      .then((res) => res.content);
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

  removeShapeAndToggleIfNeeded = (shape: TribontShape) => {
    if (shape.id === this.args.defaultShape?.id) {
      this.args.toggleDefaultShape(shape);
    }
    this.args.removeShape(shape);
  };

  addShapeAndDimension = async () => {
    const shape = await this.args.addShape();
    this.addDimension(shape);
  };

  <template>
    <AuFieldset as |f|>
      <f.legend
        @skin='6'
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
                      @checked={{isSome
                        (and @defaultShape.id (eq shape.id @defaultShape.id))
                      }}
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
            {{on 'click' this.addShapeAndDimension}}
          >
            {{t 'road-sign-concept.add-shape'}}
          </AuButton>

          <ErrorMessage @error={{get @trafficSignalConcept.error 'shapes'}} />
        </div>
      </f.content>
    </AuFieldset>
  </template>
}
