import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import { task } from 'ember-concurrency';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import RelatedRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/related';
import type Store from 'mow-registry/services/store';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadSignConceptsRoadSignConceptRelatedController extends Controller {
  @service declare store: Store;
  declare model: ModelFrom<RelatedRoute>;

  @tracked isAddingCanContainSignals = false;
  @tracked isAddingCanBeContainedInSignals = false;

  get isSidebarOpen() {
    return (
      this.isAddingCanContainSignals || this.isAddingCanBeContainedInSignals
    );
  }

  toggleAddCanContainSignals = () => {
    this.isAddingCanContainSignals = !this.isAddingCanContainSignals;
    this.isAddingCanBeContainedInSignals = false;
  };
  toggleAddCanBeContainedInSignals = () => {
    this.isAddingCanBeContainedInSignals =
      !this.isAddingCanBeContainedInSignals;
    this.isAddingCanContainSignals = false;
  };
  reset() {
    this.isAddingCanContainSignals = false;
    this.isAddingCanBeContainedInSignals = false;
  }

  addContain = task(async (toAdd: TrafficSignalConcept) => {
    const canContain = await this.model.roadSignConcept.canContainSignals;

    canContain.push(toAdd);
    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  addToBeContained = task(async (toAdd: TrafficSignalConcept) => {
    const canBeContained =
      await this.model.roadSignConcept.canBeContainedInSignals;

    canBeContained.push(toAdd);
    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  removeCanContain = task(async (toRemove: TrafficSignalConcept) => {
    const canContain = await this.model.roadSignConcept.canContainSignals;

    removeItem(canContain, toRemove);

    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  removeCanBeContained = task(async (toRemove: TrafficSignalConcept) => {
    const canBeContained =
      await this.model.roadSignConcept.canBeContainedInSignals;

    removeItem(canBeContained, toRemove);

    await this.store.request(saveRecord(this.model.roadSignConcept));
  });
}
