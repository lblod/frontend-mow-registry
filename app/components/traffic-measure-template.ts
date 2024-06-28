import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { SafeString } from '@ember/template/-private/handlebars';
import { unwrap } from 'mow-registry/utils/option';
import TrafficSignConceptModel from 'mow-registry/models/traffic-sign-concept';
import TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';

type Args = {
  concept: TrafficMeasureConceptModel;
};

export default class TrafficMeasureTemplateComponent extends Component<Args> {
  @tracked template?: SafeString;

  @action
  async didInsert() {
    console.log('this.args.concept', this.args.concept);
    await this.fetchTemplate.perform(this.args.concept);
  }

  fetchTemplate = task(async (concept: TrafficMeasureConceptModel) => {
    const template = unwrap(await concept.template);
    console.log('template', template);
    let preview = template?.value ?? '';
    const mappings = (await template.mappings).slice();
    for (const mapping of mappings) {
      let replaceString;
      if (mapping.type === 'instruction') {
        const instruction = await mapping.instruction;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          (instruction.value ?? '') +
          '</span>';
        preview = preview.replaceAll(
          '${' + (mapping.variable ?? '') + '}',
          replaceString,
        );
      }
    }

    this.template = htmlSafe(preview);
  });
}
