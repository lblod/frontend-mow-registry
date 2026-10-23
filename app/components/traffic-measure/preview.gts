import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import { Await } from '@warp-drive/ember';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
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
        {{#each sign.item.subSigns as |subSign|}}
          <img
            src={{get (get (get subSign 'image') 'file') 'downloadLink'}}
            alt=''
            class='au-c-thumbnail'
          />
        {{/each}}
        <br />
      {{/each}}
    </div>
  </div>
</template>;

export default Preview;
