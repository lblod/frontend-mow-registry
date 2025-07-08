import type { TOC } from "@ember/component/template-only";
import AuPill from "@appuniversum/ember-appuniversum/components/au-pill";
import t from "ember-intl/helpers/t";

interface Sig {
  Args: {
    status?: boolean;
  };
}

const ArPlichtigStatus: TOC<Sig> = <template>
  <AuPill @skin={{if @status "success" undefined}}>
    {{if
      @status
      (t "ar-plichtig-status.ar-required")
      (t "ar-plichtig-status.ar-not-required")
    }}
  </AuPill>
</template>;

export default ArPlichtigStatus;
