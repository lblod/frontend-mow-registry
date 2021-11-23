import Controller from '@ember/controller';

export default class CodelistsManagementEditController extends Controller {
  reset() {
    this.model.codelist.rollbackAttributes();
  }
}
