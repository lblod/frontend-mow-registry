export default function generateValidityFilter({
  validity,
  startDate,
  endDate,
}) {
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

function sparqlEscapeDateTime(value) {
  return '"' + new Date(value).toISOString() + '"^^xsd:dateTime';
}
