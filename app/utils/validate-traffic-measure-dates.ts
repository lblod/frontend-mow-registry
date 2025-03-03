export default async function validateTrafficMeasureDates(
  trafficMeasure: TrafficMeasureConcept,
) {
  const signs = await trafficMeasure.relatedTrafficSignConcepts;
  let maxStartDate = new Date(0);
  let minEndDate = new Date();
  minEndDate.setYear(9999);
  for (const sign of signs) {
    if (sign.startDate && sign.startDate > maxStartDate) {
      maxStartDate = sign.startDate;
    }
    if (sign.endDate && sign.endDate < minEndDate) {
      minEndDate = sign.endDate;
    }
  }
  if (trafficMeasure.startDate < maxStartDate) {
    if (!trafficMeasure._validationWarning) {
      trafficMeasure._validationWarning = {};
    }
    if (trafficMeasure._validationWarning.startDate) {
      trafficMeasure._validationWarning.startDate = {
        ...trafficMeasure._validationWarning.startDate,
        messageArray: [
          trafficMeasure._validationWarning.startDate.message,
          'errors.start-date-less-than-min-start-date',
        ],
      };
    } else {
      trafficMeasure._validationWarning.startDate = {
        message: 'errors.start-date-less-than-min-start-date',
      };
    }
  }
  if (trafficMeasure.endDate > minEndDate) {
    if (!trafficMeasure._validationWarning) {
      trafficMeasure._validationWarning = {};
    }
    if (trafficMeasure._validationWarning.endDate) {
      trafficMeasure._validationWarning.endDate = {
        ...trafficMeasure._validationWarning.endDate,
        messageArray: [
          trafficMeasure._validationWarning.endDate.message,
          'errors.end-date-more-than-max-end-date',
        ],
      };
    } else {
      trafficMeasure._validationWarning.endDate = {
        message: 'errors.end-date-more-than-max-end-date',
      };
    }
  }
}
