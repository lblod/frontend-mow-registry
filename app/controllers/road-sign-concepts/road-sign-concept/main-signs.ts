import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import MainSignsRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/main-signs';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { TrackedArray } from 'tracked-built-ins';

export default class RoadSignConceptsRoadSignConceptMainSignsController extends Controller {
  declare model: ModelFrom<MainSignsRoute>;
  @tracked isAddingMainSigns = false;
  @tracked mainSignCodeFilter = '';
  @tracked classification: RoadSignCategory | null = null;
  @tracked classificationRoadSigns: RoadSignConcept[] | null = null;

  setMainSignCodeFilter = (event: InputEvent) => {
    this.mainSignCodeFilter = (event.target as HTMLInputElement).value;
  };

  addMainSign = task(async (mainSign: RoadSignConcept) => {
    const mainSigns = await this.model.roadSignConcept.mainSigns;

    mainSigns.push(mainSign);
    if (this.classificationRoadSigns) {
      removeItem(this.classificationRoadSigns, mainSign);
    }
    await this.model.roadSignConcept.save();
  });

  removeMainSign = task(async (mainSign) => {
    const mainSigns = await this.model.roadSignConcept.mainSigns;

    removeItem(mainSigns, mainSign);

    if (this.classificationRoadSigns) {
      this.classificationRoadSigns.push(mainSign);
    }

    await this.model.roadSignConcept.save();
  });

  handleCategorySelection = task(async (classification: RoadSignCategory) => {
    if (classification) {
      this.classification = classification;
      // TODO: this only returns the first 20 records, we should use a query instead
      const classificationRoadSigns = await classification.roadSignConcepts;
      const relatedRoadSigns =
        this.model.roadSignConcept.relatedRoadSignConcepts;
      const mainRoadSigns = await this.model.roadSignConcept.mainSigns;

      this.classificationRoadSigns = new TrackedArray(
        classificationRoadSigns.filter((roadSign) => {
          return (
            roadSign.id !== this.model.roadSignConcept.id &&
            !relatedRoadSigns?.includes(roadSign) &&
            !mainRoadSigns.includes(roadSign)
          );
        }),
      );
    } else {
      this.classification = null;
      this.classificationRoadSigns = null;
    }
  });

  toggleAddMainSigns = () => {
    this.isAddingMainSigns = !this.isAddingMainSigns;
    this.mainSignCodeFilter = '';
  };

  reset() {
    this.isAddingMainSigns = false;
    this.mainSignCodeFilter = '';
    this.classification = null;
    this.classificationRoadSigns = null;
  }
}
