import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadMarkingConceptValidations from 'mow-registry/validations/road-marking-concept';

export default class RoadMarkingFormComponent extends Component {
  @service router;
  @service fileService;

  RoadMarkingConceptValidations = RoadMarkingConceptValidations;
  file;

  get isSaving() {
    return this.editRoadMarkingConceptTask.isRunning;
  }

  @action
  setImageUrl(roadMarkingConcept, event) {
    roadMarkingConcept.image = event.target.value;
    this.file = null;
  }

  @action
  setImageUpload(roadMarkingConcept, event) {
    this.file = event.target.files[0];
    roadMarkingConcept.image = this.file.name;
  }

  @action
  setRoadMarkingConceptValue(roadMarkingConcept, attributeName, event) {
    roadMarkingConcept[attributeName] = event.target.value;
  }

  editRoadMarkingConceptTask = dropTask(async (roadMarkingConcept, event) => {
    event.preventDefault();

    if (this.file) {
      let fileResponse = await this.fileService.upload(this.file);
      roadMarkingConcept.image = fileResponse.downloadLink;
    }

    await roadMarkingConcept.validate();

    if (roadMarkingConcept.isValid) {
      await roadMarkingConcept.save();

      this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        roadMarkingConcept.id
      );
    }
  });

  async willDestroy() {
    super.willDestroy(...arguments);
    this.args.roadMarkingConcept.rollbackAttributes();
  }
}
