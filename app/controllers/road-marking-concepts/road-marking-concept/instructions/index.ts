import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import type Template from 'mow-registry/models/template';
import type Route from 'mow-registry/routes/road-marking-concepts/road-marking-concept/instructions/index';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadMarkingConceptsRoadMarkingConceptInstructionsIndexController extends Controller {
  declare model: ModelFrom<Route>;

  removeTemplate = task(async (template: Template) => {
    const templates = await this.model.roadMarkingConcept.hasInstructions;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.model.roadMarkingConcept.save();
  });
}