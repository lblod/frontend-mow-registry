import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask, task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { not, or, eq } from 'ember-truth-helpers';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import { concat, fn, get } from '@ember/helper';
import PowerSelect from 'ember-power-select/components/power-select';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import ErrorMessage from 'mow-registry/components/error-message';
import IconSelect from 'mow-registry/components/icon-select';
import EditConceptLabelModal from 'mow-registry/components/edit-concept-label-modal';
import {
  COD_SINGLE_SELECT_ID,
  COD_CONCEPT_SCHEME_ID,
} from 'mow-registry/utils/constants';
import CodeList from 'mow-registry/models/code-list';
import SkosConcept from 'mow-registry/models/skos-concept';
import Store from 'mow-registry/services/store';
import type RouterService from '@ember/routing/router-service';
import Icon from 'mow-registry/models/icon';
import { removeItem } from 'mow-registry/utils/array';
import type ConceptScheme from 'mow-registry/models/concept-scheme';
import CodeListValue from 'mow-registry/models/code-list-value';
import ConceptHistoryNote from 'mow-registry/models/concept-history-note';
import { isSome } from 'mow-registry/utils/option';
import { findRecord, saveRecord } from '@warp-drive/legacy/compat/builders';
import set from 'mow-registry/helpers/set';
import setWithValue from 'mow-registry/helpers/set-with-value';

type Sig = {
  Args: {
    codelist: CodeList;
  };
};

export default class CodelistFormComponent extends Component<Sig> {
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked newValue = '';
  @tracked toDelete: (SkosConcept | CodeListValue)[] = [];
  // Icon is a subclass of SkosConcept, but inheritance types are broken due to the type brands.
  @tracked options: Array<SkosConcept | CodeListValue | Icon> = [];
  @tracked codelistTypes?: SkosConcept[];
  @tracked selectedType?: SkosConcept | null;
  @tracked selectedIcon: Icon | null = null;
  @tracked isEditingLabelWithUri: string | null = null;

  constructor(owner: unknown, args: Sig['Args']) {
    super(owner, args);
    this.fetchCodelistTypes.perform().catch((err) => {
      console.error('Error fetching codelist types', err);
    });
    this.args.codelist.concepts
      .then((concepts) => {
        this.options = concepts;
      })
      .catch((err) => {
        console.error('Error loading codelist concepts', err);
      });
  }

  get valueOptions() {
    return this.options
      .filter((model) => !(model instanceof Icon))
      .toSorted(
        (a, b) =>
          ('position' in a ? a.position ?? 0 : -1) -
          ('position' in b ? b.position ?? 0 : -1),
      ) as (SkosConcept | CodeListValue)[];
  }

  get iconOptions() {
    return this.options?.filter((model) => model instanceof Icon) ?? [];
  }

  get isSaving() {
    return this.editCodelistTask.isRunning;
  }

  setPositions(): void {
    if (
      !this.valueOptions.every((concept) => concept instanceof CodeListValue)
    ) {
      // At least one of the concepts isn't a 'code-list-value', so doesn't have a position
      this.options
        .map((concept, index) =>
          // 'index' is the index in the concepts array, which we need to be able to replace it.
          // This is not the position as position doesn't count icons.
          concept instanceof Icon ? undefined : { index, concept },
        )
        .filter(isSome)
        .map(({ index, concept }, pos) => {
          if (concept instanceof CodeListValue) {
            if (concept.position !== pos) {
              concept.position = pos;
            }
            return undefined;
          } else {
            return {
              index,
              concept: this.store.createRecord<CodeListValue>(
                'code-list-value',
                {
                  uri: concept.uri,
                  label: concept.label,
                  position: pos,
                },
              ),
            };
          }
        })
        .filter(isSome)
        .forEach(({ concept, index }) => {
          this.options.splice(index, 1, concept);
        });
    }
    // Then make sure the positions are actually up to date
    this.valueOptions.forEach((concept, pos) => {
      if (concept instanceof CodeListValue) {
        concept.position = pos;
      }
    });
  }

  fetchCodelistTypes = task(async () => {
    const typesScheme = await this.store
      .request(
        findRecord<ConceptScheme>('concept-scheme', COD_CONCEPT_SCHEME_ID),
      )
      .then((res) => res.content);
    const types = await typesScheme.concepts;
    this.codelistTypes = types;
    if (await this.args.codelist.type) {
      this.selectedType = await this.args.codelist.type;
    } else {
      this.selectedType = this.codelistTypes.find(
        (type) => type.id === COD_SINGLE_SELECT_ID,
      );
    }
  });

  @action
  async setCodelistValue(attributeName: string, event: Event) {
    this.args.codelist.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
    await this.args.codelist.validateProperty(attributeName);
  }

  @action
  updateCodelistType(type: SkosConcept) {
    this.selectedType = type;
    this.args.codelist.set('type', type);
  }

  @action
  addNewValue(event: Event) {
    event.preventDefault();
    if (this.newValue) {
      const codeListOption = this.store.createRecord<CodeListValue>(
        'code-list-value',
        {
          label: this.newValue,
          position: this.options.length,
        },
      );
      this.options.push(codeListOption);
      this.newValue = '';
    }
  }

  @action
  removeOption(option: SkosConcept | CodeListValue) {
    removeItem(this.options, option);
    this.toDelete.push(option);
  }

  @action
  updateIconSelector(icon: Icon) {
    this.selectedIcon = icon;
  }

  @action
  addNewIcon(event: MouseEvent) {
    event.preventDefault();
    if (this.selectedIcon) {
      this.options.push(this.selectedIcon);
      this.selectedIcon = null;
    }
  }

  @action
  removeIcon(icon: Icon) {
    removeItem(this.options, icon);
  }

  editCodelistTask = dropTask(async (codelist: CodeList, event: InputEvent) => {
    event.preventDefault();

    await codelist.validate();

    if (!codelist.error) {
      this.setPositions();
      await Promise.all(this.toDelete.map((option) => option.destroyRecord()));
      await Promise.all(
        this.options.map((option) => this.store.request(saveRecord(option))),
      );
      await this.store.request(saveRecord(codelist));
      await this.router.transitionTo(
        'codelists-management.codelist',
        codelist.id,
      );
    }
  });

  @action
  cancelEditingTask() {
    if (this.args.codelist.isNew) {
      this.router.transitionTo('codelists-management');
    } else {
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i];
        if (option && (option.hasDirtyAttributes || option.isNew)) {
          option.rollbackAttributes();
          i--;
        }
      }

      for (let i = 0; i < this.toDelete.length; i++) {
        const option = this.toDelete[i];
        if (option && !option.isNew) {
          option.rollbackAttributes();
          this.options.push(option);
        }
      }

      this.router.transitionTo(
        'codelists-management.codelist',
        this.args.codelist.id,
      );
    }
  }

  changeConceptLabel = async (concept, newLabel, explanation) => {
    const historyNote = this.store.createRecord<ConceptHistoryNote>(
      'concept-history-note',
      {
        createdOn: new Date(),
        previousConceptLabel: concept.label,
        value: explanation,
        concept,
      },
    );
    concept.label = newLabel;

    await Promise.all([
      this.store.request(saveRecord(historyNote)),
      this.store.request(saveRecord(concept)),
    ]);

    this.isEditingLabelWithUri = null;
  };

  willDestroy() {
    super.willDestroy();
    this.args.codelist.reset();
  }

  <template>
    <AuToolbar @border='bottom' @size='large' as |Group|>
      <Group>
        <AuHeading @skin='2'>
          {{#if @codelist.isNew}}
            {{t 'codelist.crud.new'}}
          {{else}}
            {{t 'codelist.crud.edit'}}
          {{/if}}
        </AuHeading>
      </Group>

      <Group>
        <AuButtonGroup>
          <AuButton
            @disabled={{or (isSome @codelist.error) this.isSaving}}
            {{on 'click' (perform this.editCodelistTask @codelist)}}
          >
            {{t 'utility.save'}}
          </AuButton>
          <AuButton @skin='secondary' {{on 'click' this.cancelEditingTask}}>
            {{t 'utility.cancel'}}
          </AuButton>
        </AuButtonGroup>
      </Group>
    </AuToolbar>

    <div class='au-c-body-container au-c-body-container--scroll'>
      <div class='au-u-max-width-small'>
        <div class='au-o-box'>
          <form class='au-c-form' novalidate>
            {{#let (get @codelist.error 'label') as |error|}}
              <div>
                <AuLabel
                  @error={{isSome error}}
                  for='label'
                  @required={{true}}
                  @requiredLabel={{t 'utility.required'}}
                >
                  {{t 'codelist.attr.label'}}&nbsp;
                </AuLabel>
                <AuInput
                  @error={{isSome error}}
                  @width='block'
                  id='label'
                  required='required'
                  value={{@codelist.label}}
                  {{on 'input' (fn this.setCodelistValue 'label')}}
                />
                <ErrorMessage @error={{error}} />
              </div>
            {{/let}}

            <div>
              <AuLabel for='label'>
                {{t 'codelist.attr.type'}}&nbsp;
              </AuLabel>
              {{#if this.codelistTypes}}
                <PowerSelect
                  @allowClear={{false}}
                  @searchEnabled={{false}}
                  @options={{this.codelistTypes}}
                  @selected={{this.selectedType}}
                  @onChange={{this.updateCodelistType}}
                  as |type|
                >
                  {{t (concat 'codelist.attr.types.' type.label)}}
                </PowerSelect>
              {{/if}}
            </div>

            <AuTable>
              <:header>
                <tr>
                  <th>
                    {{t 'codelist.attr.icons'}}
                  </th>
                  <th class='w-px'>
                    <span class='au-u-hidden-visually'>
                      {{t 'utility.delete'}}
                    </span>
                  </th>
                </tr>
              </:header>
              <:body>
                {{#each this.iconOptions as |icon|}}
                  <tr>
                    <td>
                      <div class='au-u-flex'>
                        <img
                          src={{get (get icon.image 'file') 'downloadLink'}}
                          alt=''
                          height='50'
                          class='au-u-margin-right'
                        />
                        <span
                          class='au-u-flex-self-center'
                        >{{icon.label}}</span>
                      </div>
                    </td>
                    <td class='w-px au-u-padding-right-small'>
                      <AuButton
                        @icon='bin'
                        @alert={{true}}
                        @skin='secondary'
                        @hideText={{true}}
                        {{on 'click' (fn this.removeIcon icon)}}
                      >
                        {{t 'utility.delete'}}
                      </AuButton>
                    </td>
                  </tr>
                {{else}}
                  <tr>
                    <td colspan='2'>

                      {{t 'codelist.crud.no-icon'}}
                    </td>
                  </tr>
                {{/each}}
              </:body>
              <:footer>
                <tr>
                  <td class='max-w-prose'>
                    <IconSelect
                      @onChange={{this.updateIconSelector}}
                      @selected={{this.selectedIcon}}
                    />
                  </td>
                  <td class='au-u-padding-right-small'>
                    <AuButton
                      @disabled={{not this.selectedIcon}}
                      {{on 'click' this.addNewIcon}}
                    >
                      {{t 'codelist.crud.add-icon'}}
                    </AuButton>
                  </td>
                </tr>
              </:footer>
            </AuTable>

            <AuTable>
              <:header>
                <tr>
                  <th>
                    {{t 'codelist.attr.values'}}
                  </th>
                  <th class='w-px'>
                    <span class='au-u-hidden-visually'>
                      {{t 'codelist.crud.delete-value'}}
                    </span>
                  </th>
                </tr>
              </:header>
              <:body>
                {{#each this.valueOptions as |option|}}
                  <tr>
                    <td>
                      <div class='au-u-flex au-u-flex--vertical-center'>
                        <p class='max-w-prose'>
                          {{option.label}}
                        </p>
                        <AuButton
                          @icon='pencil'
                          @skin='naked'
                          @hideText={{true}}
                          {{on
                            'click'
                            (set this 'isEditingLabelWithUri' option.uri)
                          }}
                        />
                      </div>
                      {{#if (eq this.isEditingLabelWithUri option.uri)}}
                        <EditConceptLabelModal
                          @onCancel={{set this 'isEditingLabelWithUri' null}}
                          @onSubmit={{this.changeConceptLabel}}
                          @concept={{option}}
                        />
                      {{/if}}
                    </td>
                    <td>
                      <AuButton
                        @icon='bin'
                        @alert={{true}}
                        @skin='secondary'
                        @hideText={{true}}
                        {{on 'click' (fn this.removeOption option)}}
                      >
                        {{t 'utility.delete'}}
                      </AuButton>
                    </td>
                  </tr>
                {{else}}
                  <tr>
                    <td colspan='2'>
                      {{t 'codelist.crud.no-value'}}
                    </td>
                  </tr>
                {{/each}}
              </:body>
              <:footer>
                <tr>
                  <td colspan='2'>
                    <div
                      class='au-u-flex au-u-flex--vertical-centered au-u-flex--spaced-small'
                    >
                      <AuInput
                        id='values'
                        required='required'
                        value={{this.newValue}}
                        @width='block'
                        {{on 'input' (setWithValue this 'newValue')}}
                      />
                      <AuButton
                        class='no-flex-shrink'
                        @disabled={{not this.newValue.length}}
                        {{on 'click' this.addNewValue}}
                      >
                        {{t 'codelist.crud.add-value'}}
                      </AuButton>
                    </div>
                  </td>
                </tr>
              </:footer>
            </AuTable>
          </form>
        </div>
      </div>
    </div>
  </template>
}
