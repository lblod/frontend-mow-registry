import { optionMapOr } from 'mow-registry/utils/option';
import * as RDF from '@rdfjs/types';

export type BindingObject<Obj extends Record<string, string | string[]>> = {
  [Prop in keyof Obj]: { value: string };
};

export interface QueryResult<Binding = Record<string, RDF.Term>> {
  results: {
    bindings: Binding[];
  };
}

interface QueryConfig {
  query: string;
  endpoint: string;
  abortSignal?: AbortSignal;
  useGet?: boolean;
}

export const sparqlEscapeString = (value: string) =>
  '"""' + value.replace(/[\\"]/g, (match) => '\\' + match) + '"""';

export const sparqlEscapeUri = (value: string) => {
  return (
    '<' +
    value.replace(/[\\"<>]/g, function (match) {
      return '\\' + match;
    }) +
    '>'
  );
};

export function sparqlEscapeBool(value: boolean) {
  return value ? '"true"^^xsd:boolean' : '"false"^^xsd:boolean';
}

export function sparqlEscapeDateTime(value: Date | string | number) {
  return '"' + new Date(value).toISOString() + '"^^xsd:dateTime';
}

export async function executeQuery<Binding = Record<string, RDF.Term>>({
  query,
  endpoint,
  abortSignal,
  useGet,
}: QueryConfig) {
  const encodedQuery = encodeURIComponent(query.trim());

  const params = new URLSearchParams();
  params.append('query', query);

  const fetchOptions: RequestInit = {
    mode: 'cors',
    headers: {
      Accept: 'application/sparql-results+json',
    },
    signal: abortSignal,
  };

  let finalUrl = endpoint;

  if (useGet) {
    finalUrl = `${endpoint}?${params.toString()}`;
  } else {
    fetchOptions.method = 'POST';
    (fetchOptions.headers as { [key: string]: string })['Content-Type'] =
      'application/x-www-form-urlencoded; charset=UTF-8';
    fetchOptions.body = `query=${encodedQuery}`;
  }

  const response = await fetch(finalUrl, fetchOptions);

  if (response.ok) {
    return response.json() as Promise<QueryResult<Binding>>;
  } else {
    throw new Error(
      `Request to ${endpoint} was unsuccessful: [${response.status}] ${response.statusText}`,
    );
  }
}

export async function executeCountQuery(queryConfig: QueryConfig) {
  const response = await executeQuery<{ count: { value: string } }>(
    queryConfig,
  );

  return optionMapOr(0, parseInt, response.results.bindings[0]?.count.value);
}
