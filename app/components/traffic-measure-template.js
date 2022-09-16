import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class TrafficMeasureTemplateComponent extends Component {
  @tracked template;

  @action
  async didInsert() {
    await this.fetchTemplate.perform(this.args.concept);
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
