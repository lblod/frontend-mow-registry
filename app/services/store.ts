import { Store, CacheHandler } from '@warp-drive/core';
import type {
  CacheCapabilitiesManager,
  SchemaService,
  ModelSchema,
} from '@warp-drive/core/types';

import { RequestManager, Fetch } from '@warp-drive/core';
import { DefaultCachePolicy as CachePolicy } from '@warp-drive/core/store';

import JSONAPICache from '@ember-data/json-api';

import type { ResourceKey } from '@warp-drive/core-types';
import type { TypeFromInstance } from '@warp-drive/core-types/record';

import type Model from '@warp-drive/legacy/model';
import {
  buildSchema,
  instantiateRecord,
  modelFor,
  teardownRecord,
} from '@warp-drive/legacy/model';
import {
  adapterFor,
  cleanup,
  LegacyNetworkHandler,
  normalize,
  pushPayload,
  serializeRecord,
  serializerFor,
} from '@warp-drive/legacy/compat';

export default class extends Store {
  requestManager = new RequestManager()
    .use([LegacyNetworkHandler, Fetch])
    .useCache(CacheHandler);

  lifetimes = new CachePolicy({
    apiCacheHardExpires: 15 * 60 * 1000, // 15 minutes
    apiCacheSoftExpires: 1 * 30 * 1000, // 30 seconds
    constraints: {
      headers: {
        'X-WarpDrive-Expires': true,
        'Cache-Control': true,
        Expires: true,
      },
    },
  });

  createSchemaService(): SchemaService {
    return buildSchema(this);
  }

  createCache(capabilities: CacheCapabilitiesManager) {
    return new JSONAPICache(capabilities);
  }

  instantiateRecord(
    identifier: ResourceKey,
    createRecordArgs: Record<string, unknown>,
  ) {
    return instantiateRecord.call(this, identifier, createRecordArgs);
  }

  teardownRecord(record: unknown): void {
    return teardownRecord.call(this, record as Model);
  }

  modelFor<T>(type: TypeFromInstance<T>): ModelSchema<T>;
  modelFor(type: string): ModelSchema;
  modelFor(type: string): ModelSchema {
    return (modelFor.call(this, type) as ModelSchema) || super.modelFor(type);
  }

  adapterFor = adapterFor;
  serializerFor = serializerFor;
  pushPayload = pushPayload;
  normalize = normalize;
  serializeRecord = serializeRecord;

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    cleanup.call(this);
    super.destroy();
  }
}
