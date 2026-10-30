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

type SignPreviewItem = {
  mainSign: TrafficSignalConcept;
  subSigns: RoadSignConcept[];
  fakeMainSign?: boolean;
};
interface SignPreviewItemDict {
  [key: string]: SignPreviewItem;
}

export default class Preview extends Component<Sig> {
  signs = trackedFunction(this, async () => {
    const signItems = this.args.signs;
    const length = this.args.signs.length;
    if (!length) return;
    await Promise.resolve();
    const signs: SignPreviewItemDict = {};
    const subSigns = [];
    for (let signItem of signItems) {
      const sign = (await signItem.item) as TrafficSignalConcept;
      if (!sign.id) continue;
      if (!(sign instanceof RoadSignConcept)) {
        signs[sign.id] = {
          mainSign: sign as unknown as TrafficSignalConcept, // Convert to unkown first because TS doesn't allow subclasses to redefine concrete types
          subSigns: [],
        };
      } else {
        const mainSigns = await sign.mainSigns;
        if (mainSigns && mainSigns.length) {
          subSigns.push(sign);
        } else {
          signs[sign.id] = {
            mainSign: sign as unknown as TrafficSignalConcept, // Convert to unkown first because TS doesn't allow subclasses to redefine concrete types
            subSigns: [],
          };
        }
      }
    }
    for (let subSign of subSigns) {
      if (!subSign.id) continue;
      const mainSigns = await subSign.mainSigns;
      let added = false;
      for (let mainSign of mainSigns) {
        if (mainSign.id && signs[mainSign.id]) {
          const previewItem = signs[mainSign.id] as SignPreviewItem;
          previewItem.subSigns.push(subSign);
          added = true;
        }
      }
      if (!added) {
        signs[subSign.id] = {
          mainSign: subSign as unknown as TrafficSignalConcept, // Convert to unkown first because TS doesn't allow subclasses to redefine concrete types
          subSigns: [],
          fakeMainSign: true,
        };
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
