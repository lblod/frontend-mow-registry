import type RouterService from '@ember/routing/router-service';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type Dimension from 'mow-registry/models/dimension';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import SkosConcept from 'mow-registry/models/skos-concept';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import TribontShape from 'mow-registry/models/tribont-shape';
import { tracked } from '@glimmer/tracking';
import { removeItem } from 'mow-registry/utils/array';
import Store from '@ember-data/store';
import type Variable from 'mow-registry/models/variable';
import type { ModifiableKeysOfType } from 'mow-registry/utils/type-utils';
import BreadcrumbsItem from '@bagaar/ember-breadcrumbs/components/breadcrumbs-item';
import t from 'ember-intl/helpers/t';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuToggleSwitch from '@appuniversum/ember-appuniversum/components/au-toggle-switch';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import ErrorMessage from 'mow-registry/components/error-message';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';
import ZonalitySelector from 'mow-registry/components/zonality-selector';
import ArPlichtigStatus from 'mow-registry/components/ar-plichtig-status';
import ImageInput from 'mow-registry/components/image-input';
import { on } from '@ember/modifier';
import { fn, get } from '@ember/helper';
// @ts-expect-error need EC v4 to get helper types...
import perform from 'ember-concurrency/helpers/perform';
import { or } from 'ember-truth-helpers';
import { LinkTo } from '@ember/routing';
import { load } from 'ember-async-data';
import { isSome } from 'mow-registry/utils/option';
import {
  validateShapes,
  validateVariables,
} from 'mow-registry/utils/validate-relations';

type Args = {
  roadSignConcept: RoadSignConcept;
  classifications: RoadSignCategory[];
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  isArray = function isArray(maybeArray: unknown) {
    return Array.isArray(maybeArray);
  };

  @tracked shapesToRemove: TribontShape[] = [];
  @tracked variablesToRemove: Variable[] = [];
  dimensionsToRemove: Dimension[] = [];

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  async setRoadSignConceptValue(
    attributeName: ModifiableKeysOfType<RoadSignConcept, string>,
    event: Event,
  ) {
    this.args.roadSignConcept[attributeName] = (
      event.target as HTMLInputElement
    ).value;
    await this.args.roadSignConcept.validateProperty(attributeName);
  }
  @action
  async setBooleanValue(
    attributeName: ModifiableKeysOfType<RoadSignConcept, boolean>,
    value: boolean,
  ) {
    this.args.roadSignConcept[attributeName] = value;
    await this.args.roadSignConcept.validateProperty(attributeName);
  }

  @action
  async setRoadSignConceptClassification(selection: RoadSignCategory[]) {
    this.args.roadSignConcept.set('classifications', selection);
    await this.args.roadSignConcept.validateProperty('classifications');
  }

  @action
  async setRoadsignDate(
    attribute: string,
    isoDate: string | null,
    date: Date | null,
  ) {
    if (date && attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    if (date) {
      this.args.roadSignConcept.set(attribute, date);
    } else {
      this.args.roadSignConcept.set(attribute, undefined);
    }
    await this.args.roadSignConcept.validateProperty('startDate', {
      warnings: true,
    });
    await this.args.roadSignConcept.validateProperty('endDate', {
      warnings: true,
    });
  }

  @action
  async addShape() {
    const shape = this.store.createRecord<TribontShape>('tribont-shape', {});
    (await this.args.roadSignConcept.shapes).push(shape);
    return shape;
  }

  @action
  async removeShape(shape: TribontShape) {
    const shapes = await this.args.roadSignConcept.shapes;
    removeItem(shapes, shape);
    this.shapesToRemove.push(shape);
  }

  @action
  async addVariable() {
    const newVariable = this.store.createRecord<Variable>('variable', {});
    (await this.args.roadSignConcept.variables).push(newVariable);
  }

  @action
  async removeVariable(variable: Variable) {
    const variables = await this.args.roadSignConcept.variables;
    removeItem(variables, variable);
    this.variablesToRemove.push(variable);
  }

  removeDimension = async (shape: TribontShape, dimension: Dimension) => {
    removeItem(await shape.dimensions, dimension);

    this.dimensionsToRemove.push(dimension);
  };

  @action
  setImage(model: RoadSignConcept, image: File) {
    super.setImage(model, image);
    void this.args.roadSignConcept.validateProperty('image');
  }

  editRoadSignConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    const isValid = await this.args.roadSignConcept.validate();
    const areShapesValid = await validateShapes(
      this.args.roadSignConcept.shapes,
    );
    const areVariablesValid = await validateVariables(
      this.args.roadSignConcept.variables,
    );
    if (isValid && areShapesValid && areVariablesValid) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadSignConcept.set('image', imageRecord); // image gets updated, but not overwritten

      const savePromises: Promise<unknown>[] = [];
      savePromises.push(
        ...(await this.args.roadSignConcept.shapes).map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await dimension.save();
            }),
          );
          await shape.save();
        }),
      );

      savePromises.push(
        ...this.shapesToRemove.map(async (shape) => {
          await Promise.all(
            (await shape.dimensions).map(async (dimension) => {
              await dimension.destroyRecord();
            }),
          );
          await shape.destroyRecord();
        }),
      );
      savePromises.push(
        ...this.dimensionsToRemove.map((dimension) =>
          dimension.destroyRecord(),
        ),
      );

      savePromises.push(
        ...(await this.args.roadSignConcept.variables).map(async (variable) => {
          await variable.save();
        }),
      );

      savePromises.push(
        ...this.variablesToRemove.map((variable) => variable.destroyRecord()),
      );

      await Promise.all(savePromises);
      await this.args.roadSignConcept.save();
      void this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.args.roadSignConcept.id,
      );
    }
  });

  @action
  async toggleDefaultShape(shape: TribontShape) {
    const currentDefault = await this.args.roadSignConcept.defaultShape;
    if (currentDefault && currentDefault.id === shape.id) {
      this.args.roadSignConcept.set('defaultShape', null);
    } else {
      this.args.roadSignConcept.set('defaultShape', shape);
    }
  }

  willDestroy() {
    super.willDestroy();
    this.args.roadSignConcept.reset();
  }

  @action
  async updateZonality(zonality: SkosConcept) {
    this.args.roadSignConcept.set('zonality', zonality);
    await this.args.roadSignConcept.validateProperty('zonality');
  }
  <template>
    <BreadcrumbsItem as |linkClass|>
      {{#if @roadSignConcept.isNew}}
        <LinkTo @route='road-sign-concepts.new' class={{linkClass}}>
          {{t 'road-sign-concept.crud.new'}}
        </LinkTo>
      {{else}}
        <LinkTo
          @route='road-sign-concepts.edit'
          @model={{@roadSignConcept.id}}
          class={{linkClass}}
        >
          {{@roadSignConcept.label}}
        </LinkTo>
      {{/if}}
    </BreadcrumbsItem>

    <AuToolbar @border='bottom' @size='large' as |Group|>
      <Group>
        <AuHeading @skin='2'>
          {{#if @roadSignConcept.isNew}}
            {{t 'road-sign-concept.crud.new'}}
          {{else}}
            {{t 'road-sign-concept.crud.edit'}}
          {{/if}}
        </AuHeading>
      </Group>
      <Group>
        <AuButtonGroup>

          <AuButton
            @disabled={{or (isSome @roadSignConcept.error) this.isSaving}}
            @loading={{this.isSaving}}
            @loadingMessage={{t 'utility.save'}}
            {{on 'click' (perform this.editRoadSignConceptTask)}}
          >
            {{t 'utility.save'}}
          </AuButton>
          {{#if @roadSignConcept.isNew}}
            <LinkTo
              @route='road-sign-concepts'
              class='au-c-button au-c-button--secondary'
            >
              {{t 'utility.cancel'}}
            </LinkTo>
          {{else}}
            <LinkTo
              @route='road-sign-concepts.road-sign-concept'
              @model={{@roadSignConcept.id}}
              class='au-c-button au-c-button--secondary'
            >
              {{t 'utility.cancel'}}
            </LinkTo>
          {{/if}}
        </AuButtonGroup>
      </Group>
    </AuToolbar>

    <div class='au-c-body-container au-c-body-container--scroll'>
      <div class='au-o-box'>
        <div class='au-u-max-width-small'>
          <form class='au-c-form' id='edit-road-sign-concept-form' novalidate>
            <AuFormRow>

              {{#let (get @roadSignConcept.error 'arPlichtig') as |error|}}
                <AuLabel @error={{isSome error}} for='ar-plichtig'>
                  {{t 'utility.ar-plichtig'}}
                </AuLabel>
              {{/let}}
              <AuToggleSwitch
                @onChange={{fn this.setBooleanValue 'arPlichtig'}}
                @checked={{@roadSignConcept.arPlichtig}}
                id='ar-plichtig'
              >
                <ArPlichtigStatus @status={{@roadSignConcept.arPlichtig}} />
              </AuToggleSwitch>
            </AuFormRow>
            {{#let (get @roadSignConcept.error 'image') as |error|}}
              <AuFormRow>
                <ImageInput
                  {{! @glint-expect-error maybe need to move this to a getter? }}
                  @oldImage={{@roadSignConcept.image.file.downloadLink}}
                  @error={{isSome error}}
                  {{! @glint-expect-error setImage should also accept a string }}
                  @setImage={{fn this.setImage @roadSignConcept}}
                />
              </AuFormRow>
            {{/let}}
            {{#let (get @roadSignConcept.error 'label') as |error|}}
              <AuFormRow>
                <AuLabel
                  @error={{isSome error}}
                  for='label'
                  @required={{true}}
                  @requiredLabel={{t 'utility.required'}}
                >
                  {{t 'road-sign-concept.attr.label'}}&nbsp;
                </AuLabel>
                <AuInput
                  @error={{isSome error}}
                  id='label'
                  required='required'
                  value={{@roadSignConcept.label}}
                  {{on 'input' (fn this.setRoadSignConceptValue 'label')}}
                />
                <ErrorMessage @error={{error}} />
              </AuFormRow>
            {{/let}}
            {{#let (get @roadSignConcept.error 'meaning') as |error|}}
              <AuFormRow>
                <AuLabel
                  @error={{isSome error}}
                  for='meaning'
                  @required={{true}}
                  @requiredLabel={{t 'utility.required'}}
                >
                  {{t 'road-sign-concept.attr.meaning'}}&nbsp;
                </AuLabel>
                <AuTextarea
                  @error={{isSome error}}
                  @width='block'
                  class='u-min-h-20'
                  id='meaning'
                  required='required'
                  value={{@roadSignConcept.meaning}}
                  {{on 'input' (fn this.setRoadSignConceptValue 'meaning')}}
                />
                <ErrorMessage @error={{error}} />
              </AuFormRow>
            {{/let}}
            {{#let (get @roadSignConcept.error 'startDate') as |error|}}
              <AuFormRow>
                <AuLabel @error={{isSome error}} for='startDate'>
                  {{t 'utility.start-date'}}&nbsp;
                </AuLabel>
                <AuDatePicker
                  @error={{isSome error}}
                  id='startDate'
                  @value={{@roadSignConcept.startDate}}
                  @onChange={{fn this.setRoadsignDate 'startDate'}}
                />
                <ErrorMessage @error={{error}} />
              </AuFormRow>
            {{/let}}
            {{#let
              (get @roadSignConcept.error 'endDate')
              (get @roadSignConcept.warning 'endDate')
              as |error warning|
            }}
              <AuFormRow>
                <AuLabel
                  @error={{isSome error}}
                  @warning={{isSome warning}}
                  for='endDate'
                >
                  {{t 'utility.end-date'}}&nbsp;
                </AuLabel>
                <AuDatePicker
                  @error={{isSome error}}
                  @warning={{isSome warning}}
                  id='endDate'
                  @min={{@roadSignConcept.startDate}}
                  @value={{@roadSignConcept.endDate}}
                  @onChange={{fn this.setRoadsignDate 'endDate'}}
                />
                <ErrorMessage @error={{error}} @warning={{warning}} />
              </AuFormRow>
            {{/let}}
            <AuHelpText>
              {{t 'utility.modifying-validity-dates-warning'}}
            </AuHelpText>
            {{#let (get @roadSignConcept.error 'classifications') as |error|}}
              <AuFormRow>
                <AuLabel
                  @error={{isSome error}}
                  for='classifications'
                  @required={{true}}
                  @requiredLabel={{t 'utility.required'}}
                >
                  {{t 'road-sign-concept.attr.classifications'}}&nbsp;
                </AuLabel>
                <div class={{if error 'ember-power-select--error'}}>
                  {{! @glint-expect-error need to move to PS 8 }}
                  <PowerSelectMultiple
                    {{! @glint-expect-error need to move to PS 8 }}
                    @allowClear={{true}}
                    @placeholder={{t 'utility.search-placeholder'}}
                    @searchEnabled={{true}}
                    @searchMessage={{t 'utility.search-placeholder'}}
                    @noMatchesMessage={{t 'road-sign-concept.crud.no-data'}}
                    @searchField='label'
                    @options={{@classifications}}
                    @loadingMessage={{t 'utility.loading'}}
                    @selected={{@roadSignConcept.classifications}}
                    @onChange={{this.setRoadSignConceptClassification}}
                    @triggerId='classifications'
                    as |classification|
                  >
                    {{classification.label}}
                  </PowerSelectMultiple>
                </div>
                <ErrorMessage @error={{error}} />
              </AuFormRow>
            {{/let}}
            {{#let (get @roadSignConcept.error 'zonality') as |error|}}
              <AuFormRow>
                <AuLabel
                  @error={{isSome error}}
                  for='classifications'
                  @required={{true}}
                  @requiredLabel={{t 'utility.required'}}
                >
                  {{t 'utility.zonality'}}&nbsp;
                </AuLabel>
                {{#let (load @roadSignConcept.zonality) as |zonality|}}
                  {{#if zonality.isResolved}}
                    <ZonalitySelector
                      {{! @glint-expect-error not sure how we should handle this }}
                      @zonality={{zonality.value}}
                      @onChange={{this.updateZonality}}
                      {{! @glint-expect-error not sure why this doesnt accept subtypes }}
                      @model={{@roadSignConcept}}
                    />
                  {{/if}}
                {{/let}}
              </AuFormRow>
            {{/let}}
          </form>
        </div>
      </div>
    </div>
  </template>
}
