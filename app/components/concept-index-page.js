import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class ConceptIndexPageComponent extends Component {
  show = {};

  get model() {
    return this.args.model;
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
