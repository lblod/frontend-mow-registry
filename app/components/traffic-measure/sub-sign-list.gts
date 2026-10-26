import Component from '@glimmer/component';
import { get } from '@ember/helper';
import { trackedFunction } from 'reactiveweb/function';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type { PromiseBelongsTo } from '@warp-drive/legacy/model/-private/promise-belongs-to';

type Fog = {
  Args: {
    mainSign: PromiseBelongsTo<TrafficSignalConcept> | TrafficSignalConcept;
  };
};

export default class TrafficMeasureSubSignList extends Component<Fog> {
  // If the main sign is not a roadsign concept render an empty list
  subSigns = trackedFunction(this, async () => {
    await Promise.resolve();
    const mainSign = await this.args.mainSign
    if (!(mainSign instanceof RoadSignConcept)) {
      return [];
    }

    return await mainSign.subSigns;
  });

  <template>
      {{#if this.subSigns.value.length}}
        <div class='au-u-flex au-u-flex--column au-u-margin-left-large'>
          {{#each this.subSigns.value as |subSign|}}
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
      {{/if}}
  </template>
}
