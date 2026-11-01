import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import Component from '@glimmer/component';
import { get } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import type TrafficSignalListItem from 'mow-registry/models/traffic-signal-list-item';
import TrafficMeasureSubSignList from 'mow-registry/components/traffic-measure/sub-sign-list';
import { trackedFunction } from 'reactiveweb/function';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type IntlService from 'ember-intl/services/intl';
import { service } from '@ember/service';

type Sig = {
  Args: {
    signs: TrafficSignalListItem[];
  };
};

type SignPreviewItem = {
  mainSign: TrafficSignalConcept;
  subSigns: RoadSignConcept[];
};

function signalLabel(signal: TrafficSignalConcept, intl: IntlService) {
  switch (signal.signalType) {
    case 'road-sign':
      return intl.t('traffic-measure-concept.main-sign');
    case 'road-marking':
      return intl.t('traffic-measure-concept.road-marking');
    case 'traffic-light':
      return intl.t('traffic-measure-concept.traffic-light');
  }
}
async function isSubSign(signal: RoadSignConcept) {
  const classifications = await signal.classifications;
  return classifications.some((category) => category.label === 'Onderbord');
}

export default class Preview extends Component<Sig> {
  @service declare intl: IntlService;
  signs = trackedFunction(this, async () => {
    const signItems = this.args.signs;
    if (!signItems.length) return { signs: [], orphanSigns: [] };
    // Detach from the auto-tracking prelude, to prevent infinite loop/call issues, see https://github.com/universal-ember/reactiveweb/issues/129
    await Promise.resolve();
    const signsMap: Map<string, SignPreviewItem> = new Map()
    const subSigns: RoadSignConcept[] = [];
    for (const signItem of signItems) {
      const sign = (await signItem.item) as TrafficSignalConcept;
      if (!sign.id) continue;
      if (sign instanceof RoadSignConcept && (await isSubSign(sign))) {
         subSigns.push(sign);
      } else {
        signsMap.set(sign.id, {
          mainSign: sign as unknown as TrafficSignalConcept, // Convert to unkown first because TS doesn't allow subclasses to redefine concrete types
          subSigns: [],
        })
      }
    }
    const orphanSigns: RoadSignConcept[] = [];
    for (const subSign of subSigns) {
      const mainSigns = await subSign.mainSigns;
      let added = false;
      for (const mainSign of mainSigns) {
        if (!mainSign.id) continue;
        const previewItem = signsMap.get(mainSign.id);
        if (previewItem) {
          previewItem.subSigns.push(subSign);
          added = true;
        }
      }
      if (!added) {
        orphanSigns.push(subSign)
      }
    }
    return { signs: [...signsMap.values()], orphanSigns }
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
      {{#if this.signs.value}}
        {{#each this.signs.value.signs as |sign|}}
          <div
            class='traffic-measure-preview--main-sign-container au-u-margin-small au-u-padding-small'
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
              {{signalLabel sign.mainSign this.intl}}
              {{get sign.mainSign 'label'}}
            </AuHeading>
            {{#if sign.subSigns.length}}
              <TrafficMeasureSubSignList @subSigns={{sign.subSigns}} />
            {{/if}}
          </div>
        {{/each}}
        {{#each this.signs.value.orphanSigns as |orphanSign|}}
          <div
            class='traffic-measure-preview--main-sign-container au-u-margin-small au-u-padding-small traffic-measure-preview--main-sign-container-warning'
          >
          <AuHeading
              @level='6'
              @skin='6'
              class='au-u-flex au-u-flex--vertical-center'
            >
              <img
                src={{get
                  (get (get orphanSign 'image') 'file')
                  'downloadLink'
                }}
                alt=''
                class='traffic-measure-preview--sign-image au-u-margin-right-small'
              />
                {{t 'traffic-measure-concept.sub-sign'}}
                {{get orphanSign 'label'}}
            </AuHeading>
            <p>{{t 'traffic-measure-concept.fake-main-sign-warning'}}</p>
          </div>
        {{/each}}
      {{/if}}
    </div>
  </template>
}
