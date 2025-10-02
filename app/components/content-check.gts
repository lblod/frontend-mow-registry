import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import AuToggleSwitch from '@appuniversum/ember-appuniversum/components/au-toggle-switch';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import { service } from '@ember/service';
import Store from 'mow-registry/services/store';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

type Sig = {
  Args: {
    concept: TrafficSignalConcept | TrafficMeasureConcept;
  };
};

export default class ContentCheckComponent extends Component<Sig> {
  @service declare store: Store;

  update = task(async (value: boolean) => {
    this.args.concept.valid = value;
    await this.store.request(saveRecord(this.args.concept));
  });

  <template>
    <AuToggleSwitch
      @disabled={{false}}
      @checked={{@concept.valid}}
      @onChange={{perform this.update}}
    >
      {{t 'utility.valid-content'}}
    </AuToggleSwitch>
  </template>
}
