import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import ConceptRoute from './concept-route';

interface Params {
  instruction_id: string;
}
export default class InstructionRoute extends ConceptRoute {
  @service declare store: Store;

  async model(params: Params) {
    const { mainConcept } = this.modelFor(this.parentRoute);

    if (params.instruction_id === 'new') {
      let template = this.store.createRecord('template');
      template.value = '';
      mainConcept.templates.pushObject(template);
      return {
        template,
        mainConcept,
        from: this.parentRoute,
      };
    } else {
      const template = await this.store.findRecord(
        'template',
        params.instruction_id,
        {
          include: 'mappings',
        }
      );
      return {
        template,
        mainConcept,
        from: this.parentRoute,
      };
    }
  }

  resetController(controller: any) {
    controller.model.template?.rollbackAttributes();
    controller.model.mainConcept?.rollbackAttributes();
  }
}
