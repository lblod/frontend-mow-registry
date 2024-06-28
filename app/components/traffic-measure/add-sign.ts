import Component from '@glimmer/component';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Store from '@ember-data/store';
import { SignType } from 'mow-registry/components/traffic-measure/select-type';
import ConceptModel from 'mow-registry/models/concept';

type Args = {
  selectedType: SignType;
  addSign: (sign: ConceptModel) => void;
};
export default class TrafficMeasureAddSignComponent extends Component<Args> {
  @service declare store: Store;

  @tracked selected?: ConceptModel | null;

  search = restartableTask(async (searchData: string) => {
    await timeout(300);

    const queryParams: Record<string, unknown> = {};
    queryParams[this.args.selectedType.searchFilter] = searchData;
    queryParams['sort'] = this.args.selectedType.sortingField;
    queryParams['include'] = 'hasInstructions';

    const options = await this.store.query(
      this.args.selectedType.modelName,
      queryParams,
    );
    return options;
  });

  @action
  select(selected: ConceptModel) {
    this.selected = selected;
  }

  @action
  addSign(selected: ConceptModel) {
    if (selected) {
      this.args.addSign(selected);
      this.selected = null;
    }
  }
}
