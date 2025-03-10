import Template from 'mow-registry/models/template';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';
export default function validateTemplateDates(
  template: Template,
  parentSign: TrafficSignConcept,
): void {
  if (
    template.startDate &&
    parentSign.startDate &&
    template.startDate < parentSign.startDate
  ) {
    if (!template._validationWarning) {
      template._validationWarning = {};
    }
    if (template._validationWarning['startDate']) {
      template._validationWarning['startDate'] = {
        ...template._validationWarning['startDate'],
        messageArray: [
          template._validationWarning['startDate'].message,
          'errors.start-date-less-than-parent-sign',
        ],
      };
    } else {
      template._validationWarning['startDate'] = {
        message: 'errors.start-date-less-than-parent-sign',
        path: ['startDate'],
        type: '',
      };
    }
  }
  if (
    template.endDate &&
    parentSign.endDate &&
    template.endDate > parentSign.endDate
  ) {
    if (!template._validationWarning) {
      template._validationWarning = {};
    }
    if (template._validationWarning['endDate']) {
      template._validationWarning['endDate'] = {
        ...template._validationWarning['endDate'],
        messageArray: [
          template._validationWarning['endDate'].message,
          'errors.end-date-more-than-parent-sign',
        ],
      };
    } else {
      template._validationWarning['endDate'] = {
        message: 'errors.end-date-more-than-parent-sign',
        path: ['endDate'],
        type: '',
      };
    }
  }
}
