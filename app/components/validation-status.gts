import type { TOC } from '@ember/component/template-only';
import t from 'ember-intl/helpers/t';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';

type Sig = {
  Args: {
    valid?: boolean;
  };
};

const ValidationStatus: TOC<Sig> = <template>
  <AuPill @skin={{if @valid 'success' 'warning'}}>
    {{if @valid (t 'validation-status.valid') (t 'validation-status.draft')}}
  </AuPill>
</template>;

export default ValidationStatus;
