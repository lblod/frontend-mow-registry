import Route from '@ember/routing/route';

import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';

export default class RoadSignConceptsRoadSignConceptMainSignsRoute extends Route {
  @service declare store: Store;

  model() {
    return {};
  }
}
