import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import type Template from 'mow-registry/models/template';
import type Route from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept/instructions/index';
import { removeItem } from 'mow-registry/utils/array';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import { service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';
import type Store from 'mow-registry/services/store';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

export default class TrafficLightConceptsTrafficLightConceptInstructionsIndexController extends Controller {
  @service
  declare intl: IntlService;
  @service declare store: Store;
  declare model: ModelFrom<Route>;

  removeTemplate = task(async (template: Template) => {
    const templates = await this.model.trafficLightConcept.hasInstructions;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.store.request(saveRecord(this.model.trafficLightConcept));
  });
}
