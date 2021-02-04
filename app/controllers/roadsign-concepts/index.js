import Controller from '@ember/controller';
// eslint-disable-next-line ember/no-mixins
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default class RoadsignConceptsIndexController extends Controller.extend(
  DefaultQueryParamsMixin
) {}
