import type IntlService from 'ember-intl/services/intl';
import type { VariableType } from 'mow-registry/models/variable';

export const labelForVariableType = (
  intl: IntlService,
  variableType: VariableType,
) => {
  switch (variableType) {
    case 'text':
      return intl.t('utility.template-variables.text');
    case 'number':
      return intl.t('utility.template-variables.number');
    case 'date':
      return intl.t('utility.template-variables.date');
    case 'location':
      return intl.t('utility.template-variables.location');
    case 'codelist':
      return intl.t('utility.template-variables.codelist');
    case 'instruction':
      return intl.t('utility.template-variables.instruction');
  }
};
