import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type RoadSignCategory from 'mow-registry/models/road-sign-category';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';
import { isSome } from 'mow-registry/utils/option';
import { hash } from 'rsvp';
import generateValidityFilter from 'mow-registry/utils/generate-validity-filter';
import fetchManualData from 'mow-registry/utils/fetch-manual-data';
import generateMeta from 'mow-registry/utils/generate-meta';

type Params = {
  label?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
  classification?: string;
  validation?: string;
  arPlichtig?: string;
};

export default class RoadsignConceptsIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    label: { refreshModel: true },
    meaning: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    classification: { refreshModel: true },
    validation: { refreshModel: true },
    arPlichtig: { refreshModel: true },
    validityOption: { refreshModel: true },
    validityStartDate: { refreshModel: true },
    validityEndDate: { refreshModel: true },
  };

  async model(params: Params) {
    const query: Record<string, unknown> = {
      include: 'image.file,classifications',
      sort: params.sort,
      filter: {},
    };

    const { uris: roadsignConceptUris, count } = await fetchManualData(
      'road-sign-concept',
      params,
    );
    query.filter = {
      id: roadsignConceptUris.join(','),
    };
    const roadsigns = roadsignConceptUris.length
      ? await this.store.query<RoadSignConcept>(
          'road-sign-concept',
          // @ts-expect-error we're running into strange type errors with the query argument. Not sure how to fix this properly.
          // TODO: fix the query types
          query,
        )
      : [];
    roadsigns.meta = generateMeta(params, count);
    roadsigns.meta.count = count;
    return hash({
      count,
      roadSignConcepts: roadsigns,
      classifications: this.store.findAll<RoadSignCategory>(
        'road-sign-category',
        {
          reload: true,
        },
      ),
    });
  }
}
