import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
import generateValidityFilter from 'mow-registry/utils/generate-validity-filter';

type Params = {
  label?: string;
  page: number;
  size: number;
  sort: string;
  templateValue: string;
};
export default class TrafficMeasureConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
    template: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    templateValue: { refreshModel: true },
    validityOption: { refreshModel: true },
    validityStartDate: { refreshModel: true },
    validityEndDate: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      include: 'template',
      filter: {},
    };
    if (params.label) {
      query.filter.label = params.label;
    }

    if (params.templateValue) {
      query.filter.template = { preview: params.templateValue };
    }

    if (params.validityOption) {
      query.filter = {
        ...query.filter,
        ...generateValidityFilter({
          validity: params.validityOption,
          startDate: params.validityStartDate,
          endDate: params.validityEndDate,
        }),
      };
    }

    const result = await this.store.query<TrafficMeasureConcept>(
      'traffic-measure-concept',
      // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
      // TODO: fix the query types
      query,
    );

    return result;
  }
}
