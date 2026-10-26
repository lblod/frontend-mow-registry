import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
  };
};

const Preview: TOC<Sig> = <template>
  <AuHeading @level='3' @skin='3' class='au-u-margin-bottom'>
    {{t 'traffic-measure-concept.attr.preview'}}
  </AuHeading>
  {{#each @signs as |sign|}}
    <div class='traffic-measure-preview--main-sign-container au-u-margin-small au-u-padding-small'>
      <AuHeading @level='6' @skin='6' class='au-u-flex au-u-flex--vertical-center'>
        <img
          src={{get (get (get sign.item 'image') 'file') 'downloadLink'}}
          alt=''
          class='traffic-measure-preview--sign-image au-u-margin-right-small'
        />
        {{t 'traffic-measure-concept.main-sign'}} {{get sign.item 'label'}}
      </AuHeading>
      <div class='au-u-flex au-u-flex--column au-u-margin-left-large'>
        {{#each sign.item.subSigns as |subSign|}}
          <div class='au-u-margin-top-small au-u-flex au-u-flex--vertical-center'>
            <img
              src={{get (get (get subSign 'image') 'file') 'downloadLink'}}
              alt=''
              class='traffic-measure-preview--sign-image au-u-margin-right-small'
            />
            {{subSign.label}}
          </div>
        {{/each}}
      </div>
    </div>
  {{/each}}
</template>;

export default Preview;
