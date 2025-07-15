import { service } from '@ember/service';
import Component from '@glimmer/component';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import { task } from 'ember-concurrency';
import TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type Store from 'mow-registry/services/store';

type Args = {
  concept: TrafficSignalConcept;
};
export default class ContentCheckComponent extends Component<Args> {
  @service declare store: Store;

  update = task(async (value: boolean) => {
    this.args.concept.valid = value;
    await this.store.request(saveRecord(this.args.concept));
  });
}
