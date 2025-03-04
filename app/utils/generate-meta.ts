type generateMetaParams = {
  size: number;
  page: number;
};
export default function generateMeta(
  params: generateMetaParams,
  count: number,
) {
  const lastPage = count / params.size + 1;
  const meta = {
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
