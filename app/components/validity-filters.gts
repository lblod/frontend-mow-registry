import Component from "@glimmer/component";
import PowerSelect from "ember-power-select/components/power-select";
import t from "ember-intl/helpers/t";
import AuLabel from "@appuniversum/ember-appuniversum/components/au-label";
import AuDatePicker from "@appuniversum/ember-appuniversum/components/au-date-picker";
import { action } from "@ember/object";

function convertToDate(date) {
  return new Date(date);
}

export default class ValidityFilters extends Component {
  validityStatusOptions = [
    {
      value: "valid",
      label: "validity-filter.valid",
    },
    {
      value: "expired",
      label: "validity-filter.expired",
    },
    {
      value: "custom",
      label: "validity-filter.custom",
    },
  ];
  get selected() {
    return this.validityStatusOptions.find(
      (option) => option.value === this.args.value,
    );
  }
  get isCustom() {
    return this.args.value === "custom";
  }

  @action
  onChangeValidity(option) {
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
  setStartDate(isoDate: string, date: Date) {
    this.args.onChange({
      validityOption: "custom",
      startDate: date ? date.toISOString() : undefined,
      endDate: this.args.endDate,
    });
  }
  @action
  setEndDate(isoDate: string, date: Date) {
    if (date) {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    this.args.onChange({
      validityOption: "custom",
      startDate: this.args.startDate,
      endDate: date ? date.toISOString() : undefined,
    });
  }

  <template>
    <AuLabel for="validity-filter">
      {{t "validity-filter.label"}}
    </AuLabel>
    <PowerSelect
      @allowClear={{true}}
      @options={{this.validityStatusOptions}}
      @selected={{this.selected}}
      @placeholder={{t "validity-filter.placeholder"}}
      @loadingMessage={{t "utility.loading"}}
      @onChange={{this.onChangeValidity}}
      @triggerId="validity-filter"
      as |validation|
    >
      {{t validation.label}}
    </PowerSelect>
    {{#if this.isCustom}}
      <AuLabel for="startDate">
        {{t "utility.start-date"}}&nbsp;
      </AuLabel>
      <AuDatePicker
        id="startDate"
        @value={{convertToDate @startDate}}
        @onChange={{this.setStartDate}}
      />
      <AuLabel for="endDate">
        {{t "utility.end-date"}}&nbsp;
      </AuLabel>
      <AuDatePicker
        id="endDate"
        @min={{convertToDate @startDate}}
        @value={{convertToDate @endDate}}
        @onChange={{this.setEndDate}}
      />
    {{/if}}
  </template>
}
