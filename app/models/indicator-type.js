import Model, { attr } from '@ember-data/model';

export default class IndicatorTypeModel extends Model {
  @attr label;
  @attr modelName;
  @attr searchFilter;
  @attr sortingField;
  @attr labelField;
}
