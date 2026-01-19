import { isSome } from 'mow-registry/utils/option';
import {
  sparqlEscapeString,
  sparqlEscapeBool,
  sparqlEscapeDateTime,
  executeQuery,
  executeCountQuery,
} from 'mow-registry/utils/sparql-utils';

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
  PREFIX schema: <http://schema.org/>
`;

const ZONALITY_PER_TYPE = {
  'road-sign-concept': 'mobiliteit:zonaliteit',
  'traffic-measure-concept': 'ext:zonality',
};

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
  classification?: string | null;
  validation?: string | null;
  variableSignage?: string | null;
  arPlichtig?: string | null;
  validityOption?: string | null;
  validityStartDate?: string | null;
  validityEndDate?: string | null;
  templateValue?: string | null;
  zonality?: string | null;
};

type FetchManualDataReturn = {
  uris: string[];
  count: number;
};

export default async function fetchManualData(
  type: dataType,
  params: Params,
): Promise<FetchManualDataReturn> {
  const pageNumber = params.page ?? 0;
  const pageSize = params.size ?? 20;
  const resourceType = TYPES[type];
  if (!resourceType) return { uris: [], count: 0 };
  const filters = [];
  if (params.label) {
    filters.push(`
      FILTER(CONTAINS(lcase(?label), ${sparqlEscapeString(params.label.toLowerCase())}))
    `);
  }
  if (params.meaning) {
    filters.push(`
      FILTER(CONTAINS(lcase(?meaning), ${sparqlEscapeString(params.meaning.toLowerCase())}))
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
  if (isSome(params.variableSignage)) {
    if (params.variableSignage === 'true') {
      filters.push(`
        FILTER(?variableSignage = ${sparqlEscapeBool(true)})
      `);
    } else {
      filters.push(`
        FILTER NOT EXISTS {
          ?uri mobiliteit:variabeleSignalisatie ${sparqlEscapeBool(true)}
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
  if (
    params.zonality &&
    (type === 'traffic-measure-concept' || type === 'road-sign-concept')
  ) {
    if (params.zonality === 'zonal') {
      filters.push(`
        FILTER EXISTS {
          ?uri ${ZONALITY_PER_TYPE[type]} <http://register.mobiliteit.vlaanderen.be/concepts/c81c6b96-736a-48cf-b003-6f5cc3dbc55d>
        }
      `);
    } else if (params.zonality === 'non-zonal') {
      filters.push(`
        FILTER EXISTS {
          ?uri ${ZONALITY_PER_TYPE[type]} <http://register.mobiliteit.vlaanderen.be/concepts/b651931b-923c-477c-8da9-fc7dd841fdcc>
        }
      `);
    } else if (params.zonality === 'potentially-zonal') {
      filters.push(`
        FILTER EXISTS {
          ?uri ${ZONALITY_PER_TYPE[type]} <http://register.mobiliteit.vlaanderen.be/concepts/8f9367b2-c717-4be7-8833-4c75bbb4ae1f>
        }
      `);
    }
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
      ?uri schema:validFrom ?startDate.
    }
    OPTIONAL {
      ?uri schema:validUntil ?endDate.
    }
    OPTIONAL {
      ?uri dct:type  ?classification.
      ?classification mu:uuid ?classificationUuid.
    }
    OPTIONAL {
      ?uri mobiliteit:ARplichtig ?ARplichtig.
    }
    OPTIONAL {
      ?uri mobiliteit:Mobiliteitsmaatregelconcept.template ?template.
      ?template ext:preview ?templatePreview.
    }
    OPTIONAL {
      ?uri mobiliteit:variabeleSignalisatie ?variableSignage.
    }
    ${filters.join(' ')}
  `;
  const queryCount = `
    ${PREFIXES}
    SELECT (count( DISTINCT ?id) as ?count)  WHERE {
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
    endpoint: '/raw-sparql',
  });
  const countQuery = await executeCountQuery({
    query: queryCount,
    endpoint: '/raw-sparql',
  });
  const uris = response.results.bindings.map((binding) =>
    binding['id'] ? binding['id'].value : '',
  );
  return { uris, count: countQuery };
}

const SORTPARAMETERS = {
  label: '?label',
  classifications: '?classification',
  valid: '?valid',
  'ar-plichtig': '?ARplichtig',
  ':no-case:label': 'lcase(?label)',
  'variable-signage': '?variableSignage',
};

function generateSortFilter(sort: string): string {
  let direction;
  let parameter: keyof typeof SORTPARAMETERS;
  if (sort.charAt(0) === '-') {
    direction = 'DESC';
    parameter = sort.slice(1, sort.length) as keyof typeof SORTPARAMETERS;
  } else {
    direction = 'ASC';
    parameter = sort as keyof typeof SORTPARAMETERS;
  }
  return `ORDER BY ${direction}(${SORTPARAMETERS[parameter]})`;
}

function generateValidityFilter({
  validity,
  startDate,
  endDate,
}: {
  validity?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}): string {
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
        FILTER(?startDate <= ${sparqlEscapeDateTime(startDate)} || ?noStartDate)

      `);
      if (!endDate) {
        filter.push(`
          BIND(!bound(?endDate) AS ?noEndDate)
          FILTER(?endDate >= ${sparqlEscapeDateTime(startDate)} || ?noEndDate)
        `);
      }
    }
    if (endDate) {
      filter.push(`
        BIND(!bound(?endDate) AS ?noEndDate)
        FILTER(?endDate >= ${sparqlEscapeDateTime(endDate)} || ?noEndDate)

      `);
      if (!startDate) {
        filter.push(`
          BIND(!bound(?startDate) AS ?noStartDate)
          FILTER(?startDate <= ${sparqlEscapeDateTime(endDate)} || ?noStartDate)
        `);
      }
    }
    return filter.join(' ');
  }
  return '';
}
