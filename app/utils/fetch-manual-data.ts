import { isSome } from 'mow-registry/utils/option';
import generateValidityFilter from 'mow-registry/utils/generate-validity-filter';

const TYPES = {
  'road-sign-concept': 'mobiliteit:Verkeersbordconcept',
  'road-marking-concept': 'mobiliteit:Wegmarkeringconcept',
  'traffic-light-concept': 'mobiliteit:Verkeerslichtconcept',
  'traffic-measure-concept': 'mobiliteit:Mobiliteitmaatregelconcept',
};
const PREFIXES = `
  PREFIX mobiliteit: <https://data.vlaanderen.be/ns/mobiliteit#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>

`;
export default async function fetchManualData(type, params) {
  const pageNumber = params.page ?? 0;
  const pageSize = params.size ?? 20;
  const resourceType = TYPES[type];
  if (!resourceType) return [];
  let filters = [];
  if (params.label) {
    filters.push(`
      FILTER(CONTAINS(?label, ${sparqlEscapeString(params.label)}))
    `);
  }
  if (params.meaning) {
    filters.push(`
      FILTER(CONTAINS(?meaning, ${sparqlEscapeString(params.meaning)}))
    `);
  }
  if (params.classification) {
    filters.push(`
      FILTER(?classificationUuid = ${sparqlEscapeString(params.classification)})
    `);
  }
  if (isSome(params.validation)) {
    if (params.validation === 'true') {
      filters.push(`
        FILTER(?valid = ${sparqlEscapeBool(true)})
      `);
    } else {
      filters.push(`
        FILTER NOT EXISTS {
          ?uri ext:valid ${sparqlEscapeBool(true)}
        }
      `);
    }
  }
  if (isSome(params.arPlichtig)) {
    if (params.arPlichtig === 'true') {
      filters.push(`
        FILTER(?ARplichtig = ${sparqlEscapeBool(true)})
      `);
    } else {
      filters.push(`
        FILTER NOT EXISTS {
          ?uri mobiliteit:ARplichtig ${sparqlEscapeBool(true)}
        }
      `);
    }
  }
  if (params.validityOption) {
    filters.push(
      generateValidityFilter({
        validity: params.validityOption,
        startDate: params.validityStartDate,
        endDate: params.validityEndDate,
      }),
    );
  }
  if (params.templateValue) {
    filters.push(`
      FILTER(CONTAINS(?templatePreview, ${sparqlEscapeString(params.templateValue)}))
    `);
  }
  const sortFilter = params.sort ? generateSortFilter(params.sort) : '';
  const queryContent = `
    ?uri a ${TYPES[type]}.
    ?uri mu:uuid ?id.
    OPTIONAL {
      ?uri skos:prefLabel ?label.
    }
    OPTIONAL {
      ?uri skos:scopeNote ?meaning.
    }
    OPTIONAL {
      ?uri ext:valid ?valid.
    }
    OPTIONAL {
      ?uri ext:startDate ?startDate.
    }
    OPTIONAL {
      ?uri ext:endDate ?endDate.
    }
    OPTIONAL {
      ?uri dct:type  ?classification.
      ?classification mu:uuid ?classificationUuid.
    }
    OPTIONAL {
      ?uri mobiliteit:ARplichtig ?ARplichtig.
    }
    OPTIONAL {
      ?uri mobiliteit:template ?template.
      ?template ext:preview ?templatePreview.
    }
    ${filters.join(' ')}
  `;
  let queryCount = `
    ${PREFIXES}
    SELECT (count( ?id) as ?count)  WHERE {
      ${queryContent}
    }
`;
  let query = `
    ${PREFIXES}
    SELECT DISTINCT ?id WHERE {
      ${queryContent}
    }
    ${sortFilter} LIMIT ${pageSize} OFFSET ${pageNumber * pageSize}
  `;
  const response = await executeQuery({
    query,
    endpoint: 'http://localhost/sparql',
  });
  const countQuery = await executeCountQuery({
    query: queryCount,
    endpoint: 'http://localhost/sparql',
  });
  const uris = response.results.bindings.map((binding) => binding.id.value);
  return { uris, count: countQuery };
}

const sparqlEscapeString = (value: string) =>
  '"""' + value.replace(/[\\"]/g, (match) => '\\' + match) + '"""';

const sparqlEscapeUri = (value: string) => {
  return (
    '<' +
    value.replace(/[\\"<>]/g, function (match) {
      return '\\' + match;
    }) +
    '>'
  );
};

function sparqlEscapeBool(value) {
  return value ? '"true"^^xsd:boolean' : '"false"^^xsd:boolean';
}

async function executeQuery<Binding = Record<string, RDF.Term>>({
  query,
  endpoint,
  abortSignal,
}: QueryConfig) {
  const encodedQuery = encodeURIComponent(query.trim());

  const response = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `query=${encodedQuery}`,
    signal: abortSignal,
  });

  if (response.ok) {
    return response.json() as Promise<QueryResult<Binding>>;
  } else {
    throw new Error(
      `Request to ${endpoint} was unsuccessful: [${response.status}] ${response.statusText}`,
    );
  }
}

async function executeCountQuery(queryConfig: QueryConfig) {
  const response = await executeQuery<{ count: { value: string } }>(
    queryConfig,
  );

  return optionMapOr(0, parseInt, response.results.bindings[0]?.count.value);
}

const SORTPARAMETERS = {
  label: '?label',
  classifications: '?classification',
  valid: '?valid',
  'ar-plichtig': '?ARplichtig',
  ':no-case:label': 'lcase(?label)',
};

function generateSortFilter(sort) {
  console.log(sort);
  let direction;
  let parameter;
  if (sort.charAt(0) === '-') {
    direction = 'ASC';
    parameter = sort.slice(1, sort.length);
  } else {
    direction = 'DESC';
    parameter = sort;
  }
  return `ORDER BY ${direction}(${SORTPARAMETERS[parameter]})`;
}

function optionMapOr<A, U>(
  defaultValue: U,
  func: (thing: A) => U,
  thing: Option<A>,
): U {
  if (isSome(thing)) {
    return func(thing);
  }
  return defaultValue;
}
