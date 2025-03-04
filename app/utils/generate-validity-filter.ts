export default function generateValidityFilter({
  validity,
  startDate,
  endDate,
}) {
  if (validity === 'valid') {
    return `
      FILTER(?endDate > now())
      FILTER(?startDate < now())
    `;
  } else if (validity === 'expired') {
    return `
      FILTER(?endDate < now())
    `;
  } else if (validity === 'custom') {
    const filter = [];
    if (startDate) {
      filter.push(`FILTER(?startDate > ${sparqlEscapeDateTime(startDate)})`);
    }
    if (endDate) {
      filter.push(` FILTER(?endDate < ${sparqlEscapeDateTime(endDate)})`);
    }
    return filter.join(' ');
  }
}

function sparqlEscapeDateTime(value) {
  return '"' + new Date(value).toISOString() + '"^^xsd:dateTime';
}
