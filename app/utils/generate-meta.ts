import type { MetaParams } from 'mow-registry/utils/type-utils';
type GenerateMetaParams = {
  size: number;
  page: number;
};

export default function generateMeta(
  params: GenerateMetaParams,
  count: number,
): MetaParams {
  const lastPage = Math.floor(count / params.size);
  const meta: MetaParams = {
    count: count,
    pagination: {
      first: {
        number: 0,
      },
      last: {
        number: lastPage,
      },
    },
  };
  if (params.page > 0) {
    meta.pagination.prev = {
      number: params.page - 1,
    };
  }
  if (params.page < lastPage) {
    meta.pagination.next = {
      number: params.page + 1,
    };
  }
  return meta;
}
