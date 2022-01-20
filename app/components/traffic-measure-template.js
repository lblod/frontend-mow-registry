import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { task } from 'ember-concurrency';

export default class TrafficMeasureTemplateComponent extends Component {
  @tracked template;
  constructor() {
    super(...arguments);
    this.fetchTemplate.perform(this.args.concept);
    const concept = this.args.concept;
    console.log(concept);
  }
  @task
  *fetchTemplate(concept) {
    const template = (yield concept.templates).firstObject;
    let preview = template.value;
    const mappings = yield template.mappings;

    for (let j = 0; j < mappings.length; j++) {
      const mapping = mappings.objectAt(j);
      let replaceString;
      if (mapping.type === 'instruction') {
        const instruction = yield mapping.instruction;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          instruction.value +
          '</span>';
        preview = preview.replaceAll(
          '${' + mapping.variable + '}',
          replaceString
        );
      }
    }

    this.template = htmlSafe(preview);
  }
}
