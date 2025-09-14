import Service from '@ember/service';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import type IntlService from 'ember-intl/services/intl';
import type { VariableType } from 'mow-registry/models/variable';
import { assertNever } from 'mow-registry/utils/type-utils';
import type Variable from 'mow-registry/models/variable';
import type TextVariable from 'mow-registry/models/text-variable';
import type NumberVariable from 'mow-registry/models/number-variable';
import type DateVariable from 'mow-registry/models/date-variable';
import type LocationVariable from 'mow-registry/models/location-variable';
import type CodelistVariable from 'mow-registry/models/codelist-variable';
import type InstructionVariable from 'mow-registry/models/instruction-variable';

export default class VariablesService extends Service {
  @service declare store: Store;
  @service declare intl: IntlService;

  defaultLabelForVariableType = (variableType: VariableType) => {
    switch (variableType) {
      case 'text':
        return this.intl.t('utility.template-variables.text');
      case 'number':
        return this.intl.t('utility.template-variables.number');
      case 'date':
        return this.intl.t('utility.template-variables.date');
      case 'location':
        return this.intl.t('utility.template-variables.location');
      case 'codelist':
        return this.intl.t('utility.template-variables.codelist');
      case 'instruction':
        return this.intl.t('utility.template-variables.instruction');
      default:
        assertNever(variableType);
    }
  };

  async convertVariableType(existing: Variable, newType: VariableType) {
    const trafficSignalConcept = await existing.trafficSignalConcept;
    const properties = {
      label: existing.label,
      required: existing.required,
      createdOn: existing.createdOn,
      trafficSignalConcept,
    };
    switch (newType) {
      case 'text':
        return this.store.createRecord<TextVariable>(
          'text-variable',
          properties,
        );
      case 'number':
        return this.store.createRecord<NumberVariable>(
          'number-variable',
          properties,
        );
      case 'date':
        return this.store.createRecord<DateVariable>(
          'date-variable',
          properties,
        );
      case 'location':
        return this.store.createRecord<LocationVariable>(
          'location-variable',
          properties,
        );
      case 'codelist':
        return this.store.createRecord<CodelistVariable>(
          'codelist-variable',
          properties,
        );
      case 'instruction':
        return this.store.createRecord<InstructionVariable>(
          'instruction-variable',
          properties,
        );
      default:
        assertNever(newType);
    }
  }
}
