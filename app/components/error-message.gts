import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import { and } from 'ember-truth-helpers';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import type { CustomValidationErrorItem } from 'mow-registry/models/abstract-validation-model';

interface Sig {
  Args: {
    error?: CustomValidationErrorItem;
    warning?: CustomValidationErrorItem;
  };
}

const ErrorMessage: TOC<Sig> = <template>
  {{#if (and @error @error.message)}}
    <AuHelpText @error={{true}}>
      {{! @glint-expect-error this must exist but we dont have types to prove it }}
      {{t @error.message}}
    </AuHelpText>
  {{/if}}
  {{#if @warning}}
    {{#if (get @warning 'messageArray')}}
      {{#each (get @warning 'messageArray') as |message|}}
        <AuHelpText @warning={{true}}>
          {{t message}}
        </AuHelpText>
      {{/each}}
    {{else}}
      <AuHelpText @warning={{true}}>
        {{t @warning.message}}
      </AuHelpText>
    {{/if}}
  {{/if}}
</template>;

export default ErrorMessage;
