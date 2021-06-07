import Controller from '@ember/controller';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class RoadsignConceptsIndexController extends Controller {
  @tracked page = 0;
  @tracked size = 10;
  @tracked filter = '';
  @tracked sort = 'road-sign-concept-code';

  @restartableTask
  *updateSearchFilterTask(event) {
    yield timeout(300);

    this.filter = event.target.value;
    this.resetPagination();
  }

  resetPagination() {
    this.page = 0;
  }
}
