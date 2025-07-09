import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
// @ts-expect-error no types
import and from 'ember-truth-helpers/helpers/and';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import type { CustomValidationErrorItem } from 'mow-registry/models/abstract-validation-model';
import { isSome } from 'mow-registry/utils/option';

interface Sig {
  Args: {
    error?: CustomValidationErrorItem;
    warning?: CustomValidationErrorItem;
  };
}

const ErrorMessage: TOC<Sig> = <template>
  {{#if (and (isSome @error) (isSome @error.message))}}
    <AuHelpText @error={{true}}>
      {{! @glint-expect-error this must exist but we dont have types to prove it }}
      {{t @error.message}}
    </AuHelpText>
  {{/if}}
  {{#if (isSome @warning)}}
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
