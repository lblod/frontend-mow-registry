import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptIndexRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/index';
import { task } from 'ember-concurrency';

export default class RoadSignConceptsRoadsignConceptIndexController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptIndexRoute>;

  show = {};

  get isSubSign() {
    return this.model.isSubSign;
  }

  get concept() {
    return this.model.mainConcept;
  }

  removeTemplate = task(async (template) => {
    let templates = await this.concept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.concept.save();
  });
}
