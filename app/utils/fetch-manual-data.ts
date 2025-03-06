import { isSome } from 'mow-registry/utils/option';
import {
  sparqlEscapeString,
  sparqlEscapeBool,
  sparqlEscapeDateTime,
  executeQuery,
  executeCountQuery,
} from 'mow-registry/utils/sparql-utils.ts';

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

type dataType =
  | 'road-sign-concept'
  | 'road-marking-concept'
  | 'traffic-light-concept'
  | 'traffic-measure-concept';

type Params = {
  label?: string;
  meaning?: string;
  page: number;
  size: number;
  sort: string;
  classification?: string;
  validation?: string;
  arPlichtig?: string;
  validityOption?: string;
  validityStartDate?: string;
  validityEndDate?: string;
};

type FetchManualDataReturn = {
  uris: [string];
  count: number;
};

export default async function fetchManualData(
  type: dataType,
  params: Params,
): Promise<FetchManualDataReturn> {
  const pageNumber = params.page ?? 0;
  const pageSize = params.size ?? 20;
  const resourceType = TYPES[type];
  if (!resourceType) return [];
  const filters = [];
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
  const queryCount = `
    ${PREFIXES}
    SELECT (count( ?id) as ?count)  WHERE {
      ${queryContent}
    }
`;
  const query = `
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

const SORTPARAMETERS = {
  label: '?label',
  classifications: '?classification',
  valid: '?valid',
  'ar-plichtig': '?ARplichtig',
  ':no-case:label': 'lcase(?label)',
};

function generateSortFilter(sort: string): string {
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

function generateValidityFilter({ validity, startDate, endDate }): string {
  if (validity === 'valid') {
    return `
      BIND(!bound(?endDate) AS ?noEndDate)
      BIND(!bound(?startDate) AS ?noStartDate)
      FILTER(?endDate > now() || ?noEndDate)
      FILTER(?startDate < now() || ?noStartDate)
    `;
  } else if (validity === 'expired') {
    return `
      FILTER(?endDate < now())
    `;
  } else if (validity === 'custom') {
    const filter = [];
    if (startDate) {
      filter.push(`
        BIND(!bound(?startDate) AS ?noStartDate)
        FILTER(?startDate > ${sparqlEscapeDateTime(startDate)} || ?noStartDate)`);
    }
    if (endDate) {
      filter.push(`
      BIND(!bound(?endDate) AS ?noEndDate)
      FILTER(?endDate < ${sparqlEscapeDateTime(endDate)} || ?noEndDate)`);
    }
    return filter.join(' ');
  }
}
