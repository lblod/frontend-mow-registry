import { JSONAPIAdapter } from '@warp-drive/legacy/adapter/json-api';
import type Store from 'mow-registry/services/store';
import type { ModelSchema } from '@warp-drive/core/types';
import type { AdapterPayload } from '@warp-drive/legacy/compat';
import type { Snapshot } from '@warp-drive/legacy/compat/legacy-network-handler/snapshot';
import type { SnapshotRecordArray } from '@warp-drive/legacy/compat/legacy-network-handler/snapshot-record-array';
import type { QueryState } from '@warp-drive/legacy/adapter/rest';

export default class ApplicationAdapter extends JSONAPIAdapter {
  // Copy fix for includes in queries from here: https://github.com/emberjs/data/issues/9588
  override query(
    store: Store,
    type: ModelSchema,
    query: Record<string, unknown>,
  ): Promise<AdapterPayload> {
    const { include } = query;
    const normalizedInclude = Array.isArray(include)
      ? include.map(convertToKebabCase).join(',')
      : include;
    if (normalizedInclude) {
      query['include'] = normalizedInclude;
    }

    return super.query(store, type, query);
  }
  override buildQuery(snapshot: Snapshot | SnapshotRecordArray): QueryState {
    const { include } = snapshot;
    const normalizedInclude = Array.isArray(include)
      ? include.map(convertToKebabCase).join(',')
      : include;
    if (normalizedInclude) {
      snapshot['include'] = normalizedInclude;
    }
    return super.buildQuery(snapshot);
  }
}

function convertToKebabCase(camelCase: string) {
  return camelCase.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );
}
