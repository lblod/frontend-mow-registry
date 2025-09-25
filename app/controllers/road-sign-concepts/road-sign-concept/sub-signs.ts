import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import { task } from 'ember-concurrency';
import RoadSignConcept from 'mow-registry/models/road-sign-concept';
import type SubSignsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/sub-signs';
import type Store from 'mow-registry/services/store';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadSignConceptsRoadSignConceptSubSignsController extends Controller {
  @service declare store: Store;

  declare model: ModelFrom<SubSignsRoute>;
  @tracked isAddingSubSigns = false;
  @tracked subSignCodeFilter = '';

  get subSigns() {
    if (!this.subSignCodeFilter) {
      return this.model.allSubSigns;
    }

    return this.model.allSubSigns.filter((subSign) => {
      return subSign.label
        ?.toLowerCase()
        .includes(this.subSignCodeFilter.toLowerCase());
    });
  }

  setSubSignCodeFilter = (event: InputEvent) => {
    this.subSignCodeFilter = (event.target as HTMLInputElement).value;
  };

  addSubSign = task(async (subSign: RoadSignConcept) => {
    const subSigns = await this.model.roadSignConcept.subSigns;
    subSigns.push(subSign);
    removeItem(this.model.allSubSigns, subSign);
    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  removeSubSign = task(async (subSign) => {
    const subSigns = await this.model.roadSignConcept.subSigns;
    removeItem(subSigns, subSign);
    this.model.allSubSigns.push(subSign);
    await this.store.request(saveRecord(this.model.roadSignConcept));
  });

  toggleAddSubSigns = () => {
    this.isAddingSubSigns = !this.isAddingSubSigns;
    this.subSignCodeFilter = '';
  };

  reset() {
    this.isAddingSubSigns = false;
    this.subSignCodeFilter = '';
  }
}
