import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class TrafficMeasureTemplateComponent extends Component {
  @tracked template;

  @action
  async didInsert() {
    this.fetchTemplate.perform(this.args.concept);
  }

  fetchTemplate = task(async (concept) => {
    const template = (await concept.templates)[0];
    let preview = template.value;
    const mappings = await template.mappings;

    for (let j = 0; j < mappings.length; j++) {
      const mapping = mappings.objectAt(j);
      let replaceString;
      if (mapping.type === 'instruction') {
        const instruction = await mapping.instruction;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          instruction.value +
          '</span>';
        preview = preview.replaceAll(
          '${' + mapping.variable + '}',
          replaceString,
        );
      }
    }

    this.template = htmlSafe(preview);
  });
}
