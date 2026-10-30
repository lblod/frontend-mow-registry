import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import Component from '@glimmer/component';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import TrafficMeasureSubSignList from 'mow-registry/components/traffic-measure/sub-sign-list';
import { trackedFunction } from 'reactiveweb/function';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
  };
};

export default class Preview extends Component<Sig> {
  signs = trackedFunction(this, async () => {
    const signItems = this.args.signs;
    await Promise.resolve();
    const signs = {};
    for (let signItem of signItems) {
      const sign = (await signItem.item) as TrafficSignalConcept;
      if (!(sign instanceof RoadSignConcept)) {
        signs[sign.id] = { mainSign: sign, subSigns: [] };
      } else {
        const mainSigns = await sign.mainSigns;
        if (mainSigns && mainSigns.length) {
          let added = false;
          for (let mainSign of mainSigns) {
            if (signs[mainSign.id]) {
              signs[mainSign.id].subSigns.push(sign);
              added = true;
            }
          }
          if (!added) {
            signs[sign.id] = {
              mainSign: sign,
              subSigns: [],
              fakeMainSign: true,
            };
          }
        } else {
          signs[sign.id] = { mainSign: sign, subSigns: [] };
        }
      }
    }
    return Object.values(signs);
  });

  <template>
    <div ...attributes>
      <AuHeading
        @level='3'
        @skin='3'
        class='au-u-margin-bottom au-u-margin-left-small'
      >
        {{t 'traffic-measure-concept.attr.preview'}}
      </AuHeading>
      {{#each this.signs.value as |sign|}}
        <div
          class='traffic-measure-preview--main-sign-container au-u-margin-small au-u-padding-small
            {{if
              sign.fakeMainSign
              "traffic-measure-preview--main-sign-container-warning"
            }}'
        >
          <AuHeading
            @level='6'
            @skin='6'
            class='au-u-flex au-u-flex--vertical-center'
          >
            <img
              src={{get
                (get (get sign.mainSign 'image') 'file')
                'downloadLink'
              }}
              alt=''
              class='traffic-measure-preview--sign-image au-u-margin-right-small'
            />
            {{t 'traffic-measure-concept.main-sign'}}
            {{get sign.mainSign 'label'}}
          </AuHeading>
          {{#if sign.fakeMainSign}}
            <p>{{t 'traffic-measure-concept.fake-main-sign-warning'}}</p>
          {{/if}}
          {{#if sign.subSigns.length}}
            <TrafficMeasureSubSignList @subSigns={{sign.subSigns}} />
          {{/if}}
        </div>
      {{/each}}
    </div>
  </template>
}
