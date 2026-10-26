import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import TrafficMeasureSubSignList from 'mow-registry/components/traffic-measure/sub-sign-list';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
  };
};

const Preview: TOC<Sig> = <template>
  <div ...attributes>
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
        <TrafficMeasureSubSignList @mainSign={{sign.item}} />
      </div>
    {{/each}}
  </div>
</template>;

export default Preview;
