import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
  };
  Blocks: {
    template: [];
  };
};

const Preview: TOC<Sig> = <template>
  <AuHeading @level='3' @skin='3' class='au-u-margin-bottom'>
    {{t 'traffic-measure-concept.attr.preview'}}
  </AuHeading>
  <div class='au-o-box au-c-theme-gray-100 u-rounded au-u-max-width-small'>
    <div class='au-u-margin-bottom'>
      {{#each @signs as |sign|}}
        <img
          src={{get (get (get sign.item 'image') 'file') 'downloadLink'}}
          alt=''
          class='au-c-thumbnail'
        />
      {{/each}}
    </div>
    <AuHeading @level='4' @skin='4' class='au-u-margin-bottom-small'>
      {{t 'traffic-measure-concept.attr.template'}}
    </AuHeading>
    <div class='au-o-box au-o-box--small au-c-theme-gray-200 u-rounded'>
      {{yield to='template'}}
    </div>
  </div>
</template>;

export default Preview;
