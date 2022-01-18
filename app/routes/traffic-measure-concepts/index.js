import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrafficMeasureConceptsIndexRoute extends Route {
  @service store;

  queryParams = {
    code: { refreshModel: true },
    template: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async model(params) {
    let query = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      include: "templates"
    };

    if (params.code) {
      query['filter[label]'] = params.code;
    }

    const result = await this.store.query('traffic-measure-concept', query);

    for (let i = 0; i < result.length; i++) {
      const measure = result.objectAt(i);
      const template = (await measure.templates).firstObject;
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
            replaceString
          );
        }
      }

      measure.unwrapped = preview;
    }

    return result;
  }
}
