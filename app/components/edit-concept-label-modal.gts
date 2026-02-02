import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';
import { on } from '@ember/modifier';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import { localCopy } from 'tracked-toolbox';
import ConceptLabelHistory from 'mow-registry/components/concept-label-history';
import type SkosConcept from 'mow-registry/models/skos-concept';
import { task } from 'ember-concurrency';
import setWithValue from 'mow-registry/helpers/set-with-value';
import type CodeListValue from 'mow-registry/models/code-list-value';

type Sig = {
  Args: {
    concept: SkosConcept | CodeListValue;
    onCancel: () => void;
    onSubmit: (
      concept: SkosConcept | CodeListValue,
      newLabel: string,
      explanation: string,
    ) => Promise<void>;
  };
};

export default class EditConceptLabelModalComponent extends Component<Sig> {
  @localCopy('args.concept.label') declare newConceptLabel: string;

  @tracked explanation: string | null = null;

  submitNewLabel = task(async (event: SubmitEvent) => {
    if (!this.explanation) {
      return;
    }
    event.preventDefault();
    await this.args.onSubmit?.(
      this.args.concept,
      this.newConceptLabel,
      this.explanation,
    );
  });

  get isSubmitDisabled() {
    return (
      this.newConceptLabel.trim() === this.args.concept.label?.trim() ||
      !this.explanation
    );
  }

  <template>
    <AuModal @modalOpen={{true}} @closeModal={{@onCancel}}>
      <:title>{{t 'codelist.crud.edit-label'}}</:title>
      <:body>
        <AuAlert
          @title={{t 'codelist.change-label-modal.warning-title'}}
          @skin='warning'
          @icon='alert-triangle'
        >
          <p>
            {{t 'codelist.change-label-modal.warning-phrase-1'}}
          </p>
          <p>
            {{t 'codelist.change-label-modal.warning-phrase-2'}}
          </p>
        </AuAlert>
        <form
          id='change-concept-label-form'
          class='au-c-form'
          {{on 'submit' this.submitNewLabel.perform}}
        >
          <AuFormRow @alignment='inline'>
            <AuLabel for='concept-uri' required>
              {{t 'utility.uri'}}
            </AuLabel>
            <AuInput
              required
              @disabled={{true}}
              value={{@concept.uri}}
              id='concept-uri'
            />
          </AuFormRow>
          <AuFormRow>
            <AuLabel
              class='no-flex-shrink'
              for='label-value'
              required
              @required={{true}}
            >
              {{t 'codelist.crud.new-label'}}
            </AuLabel>
            <AuInput
              required
              @width='block'
              value={{this.newConceptLabel}}
              id='label-value'
              {{on 'input' (setWithValue this 'newConceptLabel')}}
            />
          </AuFormRow>
          <AuFormRow>
            <AuLabel @required={{true}} for='description'>
              {{t 'codelist.crud.reason-for-change'}}
            </AuLabel>
            <AuTextarea
              required
              id='description'
              class='au-u-1-1'
              value={{this.explanation}}
              {{on 'input' (setWithValue this 'explanation')}}
            />
          </AuFormRow>
          <ConceptLabelHistory @concept={{@concept}} />
        </form>
      </:body>
      <:footer>
        <AuButtonGroup>
          <AuButton @skin='secondary' {{on 'click' @onCancel}}>
            {{t 'utility.cancel'}}
          </AuButton>
          <AuButton
            type='submit'
            form='change-concept-label-form'
            @loading={{this.submitNewLabel.isRunning}}
            @disabled={{this.isSubmitDisabled}}
          >
            {{t 'utility.save'}}
          </AuButton>
        </AuButtonGroup>
      </:footer>
    </AuModal>
  </template>
}
