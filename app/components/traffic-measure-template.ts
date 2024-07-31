import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { SafeString } from '@ember/template/-private/handlebars';
import { unwrap } from 'mow-registry/utils/option';
import TrafficMeasureConceptModel from 'mow-registry/models/traffic-measure-concept';

type Args = {
  concept: TrafficMeasureConceptModel;
};

export default class TrafficMeasureTemplateComponent extends Component<Args> {
  @tracked template?: SafeString;

  @action
  async didInsert() {
    await this.fetchTemplate.perform(this.args.concept);
  }

  fetchTemplate = task(async (concept: TrafficMeasureConceptModel) => {
    const template = unwrap(await concept.template);
    let preview = template?.value ?? '';
    const variables = (await template.variables).slice();
    for (const variable of variables) {
      let replaceString;
      if (variable.type === 'instruction') {
        const instruction = await variable.instruction;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          (instruction.value ?? '') +
          '</span>';
        preview = preview.replaceAll(
          '${' + (variable.value ?? '') + '}',
          replaceString,
        );
      }
    }

    this.template = htmlSafe(preview);
  });
}
