import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';
import { action } from '@ember/object';
import type { Option } from 'mow-registry/utils/option';

function convertToDate(date: Option<string>) {
  // Defaulting to now was how this was when types were added, so it seems to work.
  // It may be better to explicitly set the behaviour for this case though.
  return new Date(date ?? '');
}

export type ValidityFilter = {
  validityOption: Option<string>;
  startDate?: Option<string>;
  endDate?: Option<string>;
};
export type ValidityStatusOption = {
  value: 'valid' | 'expired' | 'custom';
  label: string;
};
export interface ValidityFiltersSig {
  Args: {
    value: Option<string>;
    startDate: Option<string>;
    endDate: Option<string>;
    onChange: (validity: ValidityFilter) => void;
  };
}

export default class ValidityFilters extends Component<ValidityFiltersSig> {
  validityStatusOptions: ValidityStatusOption[] = [
    {
      value: 'valid',
      label: 'validity-filter.valid',
    },
    {
      value: 'expired',
      label: 'validity-filter.expired',
    },
    {
      value: 'custom',
      label: 'validity-filter.custom',
    },
  ];
  get selected() {
    return this.validityStatusOptions.find(
      (option) => option.value === this.args.value,
    );
  }
  get isCustom() {
    return this.args.value === 'custom';
  }

  @action
  onChangeValidity(option: Option<ValidityStatusOption>) {
    if (!option) {
      this.args.onChange({
        validityOption: null,
      });
      return;
    }

    this.args.onChange({
      validityOption: option.value,
    });
  }
  @action
  setStartDate(_isoDate: string | null, date: Date | null) {
    this.args.onChange({
      validityOption: 'custom',
      startDate: date ? date.toISOString() : undefined,
      endDate: this.args.endDate,
    });
  }
  @action
  setEndDate(_isoDate: string | null, date: Date | null) {
    if (date) {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    this.args.onChange({
      validityOption: 'custom',
      startDate: this.args.startDate,
      endDate: date ? date.toISOString() : undefined,
    });
  }

  <template>
    <AuLabel for='validity-filter'>
      {{t 'validity-filter.label'}}
    </AuLabel>
    <PowerSelect
      @allowClear={{true}}
      @options={{this.validityStatusOptions}}
      @selected={{this.selected}}
      @placeholder={{t 'validity-filter.placeholder'}}
      @loadingMessage={{t 'utility.loading'}}
      @onChange={{this.onChangeValidity}}
      @triggerId='validity-filter'
      as |validation|
    >
      {{t validation.label}}
    </PowerSelect>
    {{#if this.isCustom}}
      <AuLabel for='startDate'>
        {{t 'utility.start-date'}}&nbsp;
      </AuLabel>
      <AuDatePicker
        id='startDate'
        @value={{convertToDate @startDate}}
        @onChange={{this.setStartDate}}
      />
      <AuLabel for='endDate'>
        {{t 'utility.end-date'}}&nbsp;
      </AuLabel>
      <AuDatePicker
        id='endDate'
        @min={{convertToDate @startDate}}
        @value={{convertToDate @endDate}}
        @onChange={{this.setEndDate}}
      />
    {{/if}}
  </template>
}
