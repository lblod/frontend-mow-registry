import Component from '@glimmer/component';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Store from '@ember-data/store';
import type { SignType } from 'mow-registry/components/traffic-measure/select-type';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { isSome } from 'mow-registry/utils/option';

type Args = {
  selectedType: SignType;
  selectedValidation?: string | null;
  addSign: (sign: TrafficSignConcept) => void;
};
export default class TrafficMeasureAddSignComponent extends Component<Args> {
  @service declare store: Store;

  @tracked selected?: TrafficSignConcept | null;

  search = restartableTask(async (searchData: string) => {
    await timeout(300);

    const queryParams: Record<string, unknown> = {};
    queryParams[this.args.selectedType.searchFilter] = searchData;
    queryParams['sort'] = this.args.selectedType.sortingField;
    queryParams['include'] = 'hasInstructions';

    if (isSome(this.args.selectedValidation)) {
      if (this.args.selectedValidation === 'true') {
        queryParams['filter[valid]'] = true;
      } else {
        queryParams['filter[:or:][:has-no:valid]'] = 'yes';
        queryParams['filter[:or:][valid]'] = false;
      }
    }

    const options = await this.store.query<
      RoadSignConcept | RoadMarkingConcept | TrafficLightConcept
    >(
      this.args.selectedType.modelName,
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      queryParams,
    );
    return options;
  });

  @action
  select(selected: TrafficSignConcept) {
    this.selected = selected;
  }

  @action
  addSign(selected: TrafficSignConcept) {
    if (selected) {
      this.args.addSign(selected);
      this.selected = null;
    }
  }
}
