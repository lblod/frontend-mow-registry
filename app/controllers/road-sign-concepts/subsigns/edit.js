import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RoadSignConceptsSubsignsEditController extends Controller {
  @service router;
  @service store;

  @tracked showExitModal = false;
  @tracked showError = false;

  // hasOutstandingChanges() {
  //   if (this.args.report.hasDirtyAttributes && this.args.report.id) return true;
  //   if (this.didFilesChange) return true;
  //   return false;
  // }

  @action
  cancelModal() {
    this.showExitModal = false;
  }

  @action
  async close() {
    // if (this.isNewReport) await this.deleteReport();
    this.router.transitionTo('road-sign-concepts.road-sign-concept');
  }

  @action
  clickCloseCross() {
    // if (this.hasOutstandingChanges()) this.showExitModal = true;
    // else this.router.transitionTo('road-sign-concepts.road-sign-concept');
    this.router.transitionTo('road-sign-concepts.road-sign-concept');
  }

  @action
  async saveAndExitModal() {
    this.showExitModal = false;
    // await this.updateReport();
    this.router.transitionTo('road-sign-concepts.road-sign-concept');
  }

  @action
  async discardAndExitModal() {
    this.showExitModal = false;
    // if (this.isNewReport) await this.deleteReport();
    this.router.transitionTo('road-sign-concepts.road-sign-concept');
  }
}
