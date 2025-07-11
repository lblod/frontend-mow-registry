import { JSONAPIAdapter } from '@warp-drive/legacy/adapter/json-api';
import type { AdapterPayload } from '@ember-data/legacy-compat';
import type Store from 'mow-registry/services/store';
import type { ModelSchema } from '@warp-drive/core/types';

export default class ApplicationAdapter extends JSONAPIAdapter {
  // Copy fix for includes in queries from here: https://github.com/emberjs/data/issues/9588
  override query(
    store: Store,
    type: ModelSchema,
    query: Record<string, unknown>,
  ): Promise<AdapterPayload> {
    if (query) {
      const { include } = query;
      const normalizedInclude = Array.isArray(include)
        ? include.join(',')
        : include;

      if (normalizedInclude) {
        query['include'] = normalizedInclude;
      }
    }

    return super.query(store, type, query);
  }
}
