import { DIMENSIONS } from '.';
import {
  executeCountQuery,
  executeQuery,
  sparqlEscapeString,
  sparqlEscapeUri,
} from '../sparql-utils';

export async function sortOnDimension(
  sortParameter: string | undefined,
  pageNumber: number,
  pageSize: number,
  trafficSignConceptId: string,
) {
  const dimensionUri = getDimensionUri(sortParameter);
  const sortDirection = getSortDirection(sortParameter);
  const prefixes = `
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX icb: <https://w3id.org/isCharacterisedBy#>
    PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX qudt: <http://qudt.org/schema/qudt/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  `;

  const queryContent = `
    ?uri mu:uuid ?id;
      cidoc:P43_has_dimension ?dimension.
    ${
      dimensionUri
        ? `?dimension qudt:hasQuantityKind ${sparqlEscapeUri(dimensionUri)};
      rdf:value ?value.`
        : ''
    }
    ?trafficSignalConcept mu:uuid ${sparqlEscapeString(trafficSignConceptId)};
      icb:isCharacterisedBy ?uri.
  `;
  const sortQuery = `
    ${prefixes}
    SELECT ?id WHERE {
      ${queryContent}
    }
    ORDER BY ${sortDirection}(?value) LIMIT ${pageSize} OFFSET ${pageNumber * pageSize}
  `;

  const queryCount = `
    ${prefixes}
    SELECT (count( DISTINCT ?id) as ?count)  WHERE {
      ${queryContent}
    }
  `;
  const response = await executeQuery({
    query: sortQuery,
    endpoint: '/raw-sparql',
  });
  const countQuery = await executeCountQuery({
    query: queryCount,
    endpoint: '/raw-sparql',
  });
  const ids = response.results.bindings.map((binding) =>
    binding['id'] ? binding['id'].value : '',
  );
  return { ids, count: countQuery };
}

function getDimensionUri(sortParameter?: string) {
  if (!sortParameter) return;
  let dimension;
  if (sortParameter.charAt(0) === '-') {
    dimension = sortParameter.slice(1);
  } else {
    dimension = sortParameter;
  }
  return DIMENSIONS[dimension as keyof typeof DIMENSIONS];
}

function getSortDirection(sortParameter?: string) {
  if (!sortParameter) return 'ASC';
  return sortParameter.charAt(0) === '-' ? 'ASC' : 'DESC';
}
