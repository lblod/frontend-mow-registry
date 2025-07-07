import type { TOC } from "@ember/component/template-only";
import t from "ember-intl/helpers/t";
import AuHelpText from "@appuniversum/ember-appuniversum/components/au-help-text";
import type { CustomValidationErrorItem } from "mow-registry/models/abstract-validation-model";
import { isSome } from "mow-registry/utils/option";
import { get } from "@ember/helper";

interface Sig {
  Args: {
    error?: CustomValidationErrorItem;
    warning?: CustomValidationErrorItem;
  };
}

const ErrorMessage: TOC<Sig> = <template>
  {{#if (isSome @error)}}
    <AuHelpText @error={{true}}>
      {{t @error.message}}
    </AuHelpText>
  {{/if}}
  {{#if (isSome @warning)}}
    {{#if (get @warning "messageArray")}}
      {{#each (get @warning "messageArray") as |message|}}
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
