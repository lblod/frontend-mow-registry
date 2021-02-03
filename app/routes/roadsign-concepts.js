import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class RoadsignConceptsRoute extends Route.extend(DataTableRouteMixin) {
    modelName = 'roadsignconcept';
}