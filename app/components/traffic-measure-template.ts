import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { type SafeString } from '@ember/template';
import { task } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import { unwrap } from 'mow-registry/utils/option';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';

type Args = {
  concept: TrafficMeasureConcept;
};

export default class TrafficMeasureTemplateComponent extends Component<Args> {
  @tracked template?: SafeString;

  runFetch = modifier(() => {
    const fetchTask = this.fetchTemplate.perform(this.args.concept);
    return () => fetchTask.cancel();
  });

  fetchTemplate = task(async (concept: TrafficMeasureConcept) => {
    const template = unwrap(await concept.template);
    let preview = template?.value ?? '';
    const variables = (await template.variables).slice();
    for (const variable of variables) {
      let replaceString;
      if (variable.type === 'instruction') {
        const instruction = await variable.template;
        replaceString =
          "<span style='background-color: #ffffff'>" +
          (instruction?.value ?? '') +
          '</span>';
        preview = preview.replaceAll(
          '${' + (variable.label ?? '') + '}',
          replaceString,
        );
      }
    }

    this.template = htmlSafe(preview);
  });
}
