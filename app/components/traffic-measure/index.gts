import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Store from 'mow-registry/services/store';
import type RouterService from '@ember/routing/router-service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import perform from 'ember-concurrency/helpers/perform';
import { or } from 'ember-truth-helpers';
import t from 'ember-intl/helpers/t';
import { TrackedArray } from 'tracked-built-ins';
import type IntlService from 'ember-intl/services/intl';
import PowerSelect from 'ember-power-select/components/power-select';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import CodelistsService from 'mow-registry/services/codelists';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import Template from 'mow-registry/models/template';
import { isSome, type Option, unwrap } from 'mow-registry/utils/option';
import CodeList from 'mow-registry/models/code-list';
import type { SignalType } from 'mow-registry/components/traffic-measure/select-type';
import Variable from 'mow-registry/models/variable';
import { removeItem } from 'mow-registry/utils/array';
import validateTrafficMeasureDates from 'mow-registry/utils/validate-traffic-measure-dates';
import type SkosConcept from 'mow-registry/models/skos-concept';
import ValidationStatus from 'mow-registry/components/validation-status';
import ErrorMessage from 'mow-registry/components/error-message';
import ContentCheck from 'mow-registry/components/content-check';
import ZonalitySelector from 'mow-registry/components/zonality-selector';
import VariableSignageSelector from 'mow-registry/components/variable-signage-selector';
import TrafficMeasureSelectType, {
  trafficSignalType,
} from 'mow-registry/components/traffic-measure/select-type';
import TrafficMeasureAddSign from 'mow-registry/components/traffic-measure/add-sign';
import TrafficMeasureSignList from 'mow-registry/components/traffic-measure/sign-list';
import TrafficMeasurePreview from 'mow-registry/components/traffic-measure/preview';
import type VariablesService from 'mow-registry/services/variables-service';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type ToasterService from '@appuniversum/ember-appuniversum/services/toaster';

type Sig = {
  Args: {
    trafficMeasureConcept: TrafficMeasureConcept;
  };
  Blocks: {
    title: [];
  };
};

export default class TrafficMeasureIndexComponent extends Component<Sig> {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service('codelists') declare codeListService: CodelistsService;
  @service declare variablesService: VariablesService;
  @service declare toaster: ToasterService;

  @tracked codeLists: CodeList[] = [];
  @tracked signs: TrafficSignalListItem[] = new TrackedArray([]);
  @tracked searchString?: string;
  @tracked selectedType: SignalType = trafficSignalType;
  @tracked signsError = false;
  @tracked signValidation?: string | null;

  variablesToBeDeleted: Variable[] = [];
  get validationStatusOptions() {
    return [
      { value: 'true', label: this.intl.t('validation-status.valid') },
      { value: 'false', label: this.intl.t('validation-status.draft') },
    ];
  }

  get selectedValidationStatus() {
    return this.validationStatusOptions.find(
      (option) => option.value === this.signValidation,
    );
  }

  @action
  async updateZonality(zonality: SkosConcept) {
    this.args.trafficMeasureConcept.set('zonality', zonality);
    await this.args.trafficMeasureConcept.validateProperty('zonality');
  }

  @action
  updateValidationFilter(
    selectedOption: (typeof this.validationStatusOptions)[number],
  ) {
    if (selectedOption) {
      this.signValidation = selectedOption.value;
    } else {
      this.signValidation = null;
    }
  }

  @action
  async didInsert() {
    await this.fetchData.perform();
  }

  get new() {
    return this.args.trafficMeasureConcept?.isNew;
  }

  get isSelectedTypeEmpty() {
    return !this.selectedType;
  }

  fetchData = task(async () => {
    // Wait for data loading
    const relatedTrafficSignals =
      await this.args.trafficMeasureConcept.relatedTrafficSignalConceptsOrdered;

    this.signs = new TrackedArray(relatedTrafficSignals);
    this.signs.sort((a, b) => (a.position ?? -1) - (b.position ?? -1));
  });

  @action
  addSign(sign: TrafficSignalListItem) {
    this.signs.push(sign);
    this.selectedType = trafficSignalType;
  }

  @action
  removeSign(sign: TrafficSignalListItem) {
    removeItem(this.signs, sign);
  }

  @action
  sortSigns(signs: TrafficSignalListItem[]) {
    for (let i = 0; i < signs.length; i++) {
      const sign = signs[i];
      if (sign && sign.position !== i) {
        sign.position = i;
      }
    }
    this.signs = new TrackedArray(signs);
  }

  @action
  updateTypeFilter(selectedType: SignalType) {
    if (selectedType) {
      this.selectedType = selectedType;
    } else {
      this.selectedType = trafficSignalType;
    }
  }

  save = task(async () => {
    // We assume a measure only has one template
    const template = unwrap(await this.args.trafficMeasureConcept.template);

    // Show custom error if no signs selected
    this.signsError = !this.signs.length;

    // Validate measure fields
    const isValid = await this.args.trafficMeasureConcept.validate();

    if (!isValid) {
      return;
    }

    const hasOrphanSubsigns = await this.hasOrphanSubsigns();
    if (hasOrphanSubsigns) {
      //show a error message and prevent from saving
      return this.toaster.error(
        this.intl.t('traffic-measure-concept.error-orfan-subsigns-text'),
        this.intl.t('traffic-measure-concept.error-orfan-subsigns-title'),
        {
          closable: true,
        },
      );
    }

    // If there’s an error with the signs, return early to prevent the save from occurring
    if (this.signsError) return;

    //if new save relationships
    if (this.new) {
      await this.store.request(saveRecord(this.args.trafficMeasureConcept));
      await this.store.request(saveRecord(template));
      await this.store.request(saveRecord(this.args.trafficMeasureConcept));
    }

    //1-update roadsigns
    await this.saveRoadsigns.perform(this.args.trafficMeasureConcept);

    //2-update node shape
    let label = '';
    for (const signOrdered of this.signs) {
      const sign = await signOrdered.item;
      label = `${label}${sign?.label ?? ''}-`;
    }
    //get rid of the last dash
    label = label.slice(0, -1);
    this.args.trafficMeasureConcept.label = label;
    await this.store.request(saveRecord(this.args.trafficMeasureConcept));

    //3- generate template to conform old shape
    const dummyTemplateValue = `Templates worden niet meer gegenereerd door het MOW register`;
    template.value = dummyTemplateValue;
    template.preview = dummyTemplateValue;
    await this.store.request(saveRecord(template));

    this.router.transitionTo(
      'traffic-measure-concepts.details',
      this.args.trafficMeasureConcept.id,
    );
  });

  async hasOrphanSubsigns() {
    const trafficMeasureConcept = this.args.trafficMeasureConcept;
    const trafficSignalConceptsListItems =
      await trafficMeasureConcept.relatedTrafficSignalConceptsOrdered;
    const trafficSignalConcepts = await Promise.all(
      trafficSignalConceptsListItems.map((listItem) => listItem.item),
    );
    const roadSigns = trafficSignalConcepts.filter(
      (sign) => sign instanceof RoadSignConcept,
    ) as unknown as RoadSignConcept[];
    const mainSignIds = [];
    const subSigns: RoadSignConcept[] = [];
    for (let sign of roadSigns) {
      const mainSigns = await sign.mainSigns;
      if (mainSigns && mainSigns.length) {
        subSigns.push(sign);
      } else {
        mainSignIds.push(sign.id);
      }
    }
    for (let subSign of subSigns) {
      const mainSigns = await subSign.mainSigns;
      let orphan = true;
      for (let mainSign of mainSigns) {
        const idFound = mainSignIds.find(
          (mainSignIds) => mainSignIds === mainSign.id,
        );
        if (idFound) {
          orphan = false;
          break;
        }
      }
      if (orphan) return true;
    }
    return false;
  }

  saveRoadsigns = task(async (trafficMeasureConcept: TrafficMeasureConcept) => {
    // delete existing ones
    const existingRelatedSigns = (
      await trafficMeasureConcept.relatedTrafficSignalConceptsOrdered
    ).slice();

    const deletedSigns = existingRelatedSigns.filter(
      (sign) => !this.signs.includes(sign),
    );

    for (const sign of deletedSigns) {
      sign.deleteRecord();
      await this.store.request(saveRecord(sign));
    }

    for (const sign of this.signs) {
      await this.store.request(saveRecord(sign));
    }
    trafficMeasureConcept.set(
      'relatedTrafficSignalConceptsOrdered',
      this.signs,
    );
    await this.store.request(saveRecord(trafficMeasureConcept));
  });

  willDestroy() {
    super.willDestroy();

    const wasNew = this.args.trafficMeasureConcept?.isNew;
    this.args.trafficMeasureConcept?.rollbackAttributes();
    if (!wasNew) {
      void this.args.trafficMeasureConcept?.belongsTo('zonality').reload();
    }
  }

  @action
  async setTrafficMeasureDate(
    attribute: string,
    _isoDate: Option<string>,
    date: Option<Date>,
  ) {
    if (date && attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    if (date) {
      this.args.trafficMeasureConcept.set(attribute, date);
    } else {
      this.args.trafficMeasureConcept.set(attribute, undefined);
    }
    await this.args.trafficMeasureConcept.validateProperty('startDate', {
      warnings: true,
    });
    await this.args.trafficMeasureConcept.validateProperty('endDate', {
      warnings: true,
    });
    void validateTrafficMeasureDates(this.args.trafficMeasureConcept);
  }

  getError = (
    type: 'error' | 'warning',
    obj: Option<TrafficMeasureConcept | Template>,
    key: string,
  ) => {
    const err = obj?.[type];
    if (err) {
      return err[key];
    }
  };

  <template>
    {{#if this.signsError}}
      <AuAlert @icon='alert-triangle' @skin='warning'>
        {{t 'utility.incomplete-measure-error'}}
      </AuAlert>
    {{/if}}
    <AuToolbar @border='bottom' @size='large' as |Group|>
      <Group class='au-u-flex--vertical-center'>
        {{yield to='title'}}
        <ValidationStatus @valid={{@trafficMeasureConcept.valid}} />
      </Group>
      <Group>
        <AuButtonGroup>
          <AuButton
            {{on 'click' (perform this.save)}}
            @loading={{if this.save.isRunning true false}}
            @loadingMessage={{t 'utility.save'}}
            @disabled={{or
              (isSome @trafficMeasureConcept.error)
              this.save.isRunning
            }}
          >
            {{t 'utility.save'}}
          </AuButton>

          {{#if @trafficMeasureConcept.isNew}}
            <AuLink @skin='button-secondary' @route='traffic-measure-concepts'>
              {{t 'utility.cancel'}}
            </AuLink>
          {{else}}
            <AuLink
              @skin='button-secondary'
              @route='traffic-measure-concepts.details'
              @model={{@trafficMeasureConcept.id}}
            >
              {{t 'utility.cancel'}}
            </AuLink>
          {{/if}}
        </AuButtonGroup>
      </Group>
    </AuToolbar>

    <div
      class='au-o-grid au-o-grid--flush au-o-grid--split'
      {{didInsert this.didInsert}}
      {{! TODO: refactor did-insert }}
      {{!template-lint-disable no-at-ember-render-modifiers}}
    >
      {{! template-lint-disable no-inline-styles }}
      <div class='au-o-grid__item au-u-2-3@medium'>
        <div
          class='au-o-box au-c-body-container au-c-body-container--scroll au-c-body-container--table'
        >
          <AuToolbar class='au-u-margin-bottom' as |Group|>
            <Group>
              <AuHeading @level='3' @skin='3'>
                {{!-- {{this.label}} --}}
                {{t 'utility.properties'}}
              </AuHeading>
            </Group>
            {{#unless @trafficMeasureConcept.isNew}}
              <Group>
                <ContentCheck @concept={{@trafficMeasureConcept}} />
              </Group>
            {{/unless}}
          </AuToolbar>
          <div
            class='traffic-measure--properties-box au-u-padding au-u-margin-bottom'
          >
            <div class='au-o-grid'>
              <div class='au-o-grid__item au-u-1-2'>
                <AuHeading
                  @level='6'
                  @skin='6'
                  class='au-u-margin-bottom-small'
                >
                  {{t 'utility.zonality'}}
                </AuHeading>
                <ZonalitySelector
                  @zonality={{@trafficMeasureConcept.zonality}}
                  @onChange={{this.updateZonality}}
                  @model={{@trafficMeasureConcept}}
                />
              </div>
              <div class='au-o-grid__item au-u-1-2'>
                <AuHeading
                  @level='6'
                  @skin='6'
                  class='au-u-margin-bottom-small'
                >
                  {{t 'traffic-measure-concept.attr.variable-signage'}}
                </AuHeading>
                <VariableSignageSelector @concept={{@trafficMeasureConcept}} />
              </div>
            </div>
            <div class='au-u-flex au-u-flex--between'>
              {{#let
                (this.getError 'error' @trafficMeasureConcept 'startDate')
                (this.getError 'warning' @trafficMeasureConcept 'startDate')
                as |error warning|
              }}
                <AuFormRow class='au-u-1-2 au-u-padding-right-huge'>
                  <AuLabel
                    @error={{isSome error}}
                    @warning={{isSome warning}}
                    for='startDate'
                  >
                    {{t 'utility.start-date'}}&nbsp;
                  </AuLabel>
                  <AuDatePicker
                    @error={{isSome error}}
                    @warning={{isSome warning}}
                    class='appuniversum-datepicker-full-width'
                    id='startDate'
                    @value={{@trafficMeasureConcept.startDate}}
                    @onChange={{fn this.setTrafficMeasureDate 'startDate'}}
                  />
                  <ErrorMessage @error={{error}} @warning={{warning}} />
                </AuFormRow>
              {{/let}}
              {{#let
                (this.getError 'error' @trafficMeasureConcept 'endDate')
                (this.getError 'warning' @trafficMeasureConcept 'endDate')
                as |error warning|
              }}
                <AuFormRow
                  class='au-u-1-2 au-u-padding-left au-u-padding-right'
                >
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
                    class='appuniversum-datepicker-full-width'
                    id='endDate'
                    @min={{@trafficMeasureConcept.startDate}}
                    @value={{@trafficMeasureConcept.endDate}}
                    @onChange={{fn this.setTrafficMeasureDate 'endDate'}}
                  />
                  <ErrorMessage @error={{error}} @warning={{warning}} />
                </AuFormRow>
              {{/let}}
            </div>
          </div>
          <AuHeading
            @level='4'
            @skin='4'
            class='au-u-margin-bottom-small au-u-margin-top-small'
          >
            {{t 'traffic-measure-concept.attr.traffic-sign'}}
          </AuHeading>
          <div class='au-o-grid au-o-grid--tiny'>
            <div class='au-o-grid__item au-u-1-4@medium'>
              <AuLabel>
                {{t 'traffic-measure-concept.attr.select-type'}}
              </AuLabel>
              <TrafficMeasureSelectType
                @selectedType={{this.selectedType}}
                @updateTypeFilter={{this.updateTypeFilter}}
              />
            </div>
            <div class='au-o-grid__item au-u-1-4@medium'>
              <AuLabel>
                {{t 'traffic-measure-concept.attr.select-validation-status'}}
              </AuLabel>
              <PowerSelect
                @allowClear={{true}}
                @options={{this.validationStatusOptions}}
                @selected={{this.selectedValidationStatus}}
                @onChange={{this.updateValidationFilter}}
                as |validationType|
              >
                {{validationType.label}}
              </PowerSelect>
            </div>
            <div class='au-o-grid__item au-u-2-4@medium'>
              <TrafficMeasureAddSign
                @selectedType={{this.selectedType}}
                @selectedValidation={{this.signValidation}}
                @addSign={{this.addSign}}
                @signs={{this.signs}}
              />
            </div>
            <div class='au-o-grid__item'>
              <TrafficMeasureSignList
                @removeSign={{this.removeSign}}
                @signs={{this.signs}}
                @onSort={{this.sortSigns}}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class='au-o-grid__item au-u-1-3@medium u-border-solid u-border-l u-border-divider'
      >
        <div class='au-o-box au-c-body-container au-c-body-container--scroll'>
          <TrafficMeasurePreview @signs={{this.signs}} />
        </div>
      </div>
    </div>
  </template>
}
