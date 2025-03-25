import TrafficMeasureConcept from 'mow-registry/models/traffic-measure-concept';
export default async function validateTrafficMeasureDates(
  trafficMeasure: TrafficMeasureConcept,
): Promise<void> {
  const signs = await trafficMeasure.relatedTrafficSignConcepts;
  let maxStartDate = new Date(0);
  let minEndDate = new Date();
  minEndDate.setFullYear(9999);
  for (const sign of signs) {
    if (sign.startDate && sign.startDate > maxStartDate) {
      maxStartDate = sign.startDate;
    }
    if (sign.endDate && sign.endDate < minEndDate) {
      minEndDate = sign.endDate;
    }
  }
  if (trafficMeasure.startDate && trafficMeasure.startDate < maxStartDate) {
    if (!trafficMeasure._validationWarning) {
      trafficMeasure._validationWarning = {};
    }
    if (trafficMeasure._validationWarning['startDate']) {
      trafficMeasure._validationWarning['startDate'] = {
        ...trafficMeasure._validationWarning['startDate'],
        messageArray: [
          trafficMeasure._validationWarning['startDate'].message,
          'errors.start-date-less-than-min-start-date',
        ],
      };
    } else {
      trafficMeasure._validationWarning['startDate'] = {
        message: 'errors.start-date-less-than-min-start-date',
        path: ['startDate'],
        type: '',
      };
    }
  }
  if (trafficMeasure.endDate && trafficMeasure.endDate > minEndDate) {
    if (!trafficMeasure._validationWarning) {
      trafficMeasure._validationWarning = {};
    }
    if (trafficMeasure._validationWarning['endDate']) {
      trafficMeasure._validationWarning['endDate'] = {
        ...trafficMeasure._validationWarning['endDate'],
        messageArray: [
          trafficMeasure._validationWarning['endDate'].message,
          'errors.end-date-more-than-max-end-date',
        ],
      };
    } else {
      trafficMeasure._validationWarning['endDate'] = {
        message: 'errors.end-date-more-than-max-end-date',
        path: ['endDate'],
        type: '',
      };
    }
  }
}
