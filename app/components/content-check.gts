import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
// @ts-expect-error need EC v4 to get helper types...
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import AuToggleSwitch from '@appuniversum/ember-appuniversum/components/au-toggle-switch';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

type Sig = {
  Args: {
    concept: TrafficSignalConcept | TrafficMeasureConcept;
  };
};

export default class ContentCheckComponent extends Component<Sig> {
  update = task(async (value: boolean) => {
    this.args.concept.valid = value;
    await this.args.concept.save();
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
