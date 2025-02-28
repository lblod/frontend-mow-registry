export default function generateValidityFilter({
  validity,
  startDate,
  endDate,
}) {
  if (validity === 'valid') {
    return {
      ':gt:end-date': new Date().toISOString(),
      ':lt:start-date': new Date().toISOString(),
    };
  } else if (validity === 'expired') {
    return { ':lt:end-date': new Date().toISOString() };
  } else if (validity === 'custom') {
    return {
      ':lt:end-date': startDate,
      ':gt:start-date': endDate,
    };
  }
}
