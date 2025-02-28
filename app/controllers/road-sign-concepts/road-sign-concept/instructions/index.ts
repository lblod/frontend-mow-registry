import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import type Template from 'mow-registry/models/template';
import type RoadsignConceptsEditRoute from 'mow-registry/routes/road-sign-concepts/edit';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { service } from '@ember/service';

export default class RoadSignConceptsRoadSignConceptInstructionsIndexController extends Controller {
  @service intl;
  declare model: ModelFrom<RoadsignConceptsEditRoute>;

  removeTemplate = task(async (template: Template) => {
    const templates = await this.model.roadSignConcept.hasInstructions;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.model.roadSignConcept.save();
  });
}
