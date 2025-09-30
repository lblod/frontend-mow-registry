import { Store, CacheHandler } from '@warp-drive/core';
import type {
  CacheCapabilitiesManager,
  SchemaService,
  ModelSchema,
  LegacyResourceQuery,
  QueryOptions,
  ResourceKey,
} from '@warp-drive/core/types';

import { RequestManager, Fetch } from '@warp-drive/core';
import { DefaultCachePolicy as CachePolicy } from '@warp-drive/core/store';

import { JSONAPICache } from '@warp-drive/json-api';
import type {
  TypedRecordInstance,
  TypeFromInstance,
} from '@warp-drive/core/types/record';

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
import ArrayProxy from '@ember/array/proxy';
import { query } from '@warp-drive/legacy/compat/builders';
import type { Collection } from 'mow-registry/utils/type-utils';

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

  instantiateRecord(id: ResourceKey, args: Record<string, unknown>) {
    return instantiateRecord.call(this, id, args);
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

  // TODO: rework this method into a request builder
  async count<T extends TypedRecordInstance>(
    modelName: TypeFromInstance<T>,
    queryParams: LegacyResourceQuery<T>,
    options?: QueryOptions,
  ) {
    queryParams = {
      ...queryParams,
      page: {
        size: 1,
      },
    };
    // TODO: we still need to cast the result to a `Collection` in order to be able to access the `meta` property
    const results = await this.request(
      query<T>(modelName, queryParams, options),
    ).then((res) => res.content as Collection<T>);
    return results.meta?.['count'] as number | null | undefined;
  }

  // TODO: rework this method into a request builder
  async countAndFetchAll<T extends TypedRecordInstance>(
    modelName: TypeFromInstance<T>,
    queryParams: LegacyResourceQuery<T>,
    options?: QueryOptions,
    batchSize = 100,
  ) {
    if (
      'page' in queryParams ||
      'page[size]' in queryParams ||
      'page[number]' in queryParams
    ) {
      console.error(
        'Passed `page` to `countAndFetchAll` of query, but this will overwrite these parameters.',
      );
    }
    const count = (await this.count<T>(modelName, queryParams, options)) ?? 0;
    const nbOfBatches = Math.ceil(count / batchSize);
    const batches = [];
    for (let i = 0; i < nbOfBatches; i++) {
      const queryForBatch = {
        ...queryParams,
        page: {
          size: batchSize,
          number: i,
        },
      };
      const batch = this.request(
        query<T>(modelName, queryForBatch, options),
      ).then((res) => res.content);
      batches.push(batch);
    }
    queryParams = {
      ...queryParams,
      page: {
        size: count,
      },
    };
    const results = await Promise.all(batches);
    return ArrayProxy.create({
      content: results.map((result) => result.slice()).flat(),
      meta: {
        count,
      },
    });
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    cleanup.call(this);
    super.destroy();
  }
}
