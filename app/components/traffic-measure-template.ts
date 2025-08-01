import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { type SafeString } from '@ember/template';
import { task } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import { unwrapOr } from 'mow-registry/utils/option';
import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import type Variable from 'mow-registry/models/variable';
import { isInstructionVariable } from 'mow-registry/models/instruction-variable';

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
    const template = await concept.template;
    let preview = template?.value ?? '';
    const variables = unwrapOr(
      [] as Variable[],
      await template?.variables,
    ).slice();
    for (const variable of variables) {
      let replaceString;
      if (isInstructionVariable(variable)) {
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
