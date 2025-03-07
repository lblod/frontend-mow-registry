import Controller from '@ember/controller';
import { service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

export default class RoadsignConceptsRoadSignConceptController extends Controller {
  @service
  declare intl: IntlService;
}
