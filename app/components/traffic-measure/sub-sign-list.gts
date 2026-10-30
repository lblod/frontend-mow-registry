import type { TOC } from '@ember/component/template-only';
import { get } from '@ember/helper';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

type Sig = {
  Args: {
    subSigns: TrafficSignalConcept[];
  };
};

const TrafficMeasureSubSignList: TOC<Sig> = <template>
  <div class='au-u-flex au-u-flex--column au-u-margin-left-large'>
    {{#each @subSigns as |subSign|}}
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
</template>;

export default TrafficMeasureSubSignList;
