import AddInstruction from './add-instruction';
import { task } from 'ember-concurrency';
import { removeItem } from 'mow-registry/utils/array';
import validateTemplateDates from 'mow-registry/utils/validateTemplateDates';
import { action } from '@ember/object';

// This is a copy of the `AddInstruction` component since that is used in multiple places, but we need to adjust the layout
export default class InstructionManager extends AddInstruction {
  get canDelete() {
    return !this.new;
  }

  removeTemplate = task(async () => {
    const templates = await this.args.concept.hasInstructions;
    const template = this.args.editedTemplate;

    removeItem(templates, template);

    await template.destroyRecord();
    await this.args.concept.save();

    this.router.replaceWith(this.args.from);
  });
  @action
  async setTemplateDate(attribute, isoDate, date) {
    if (attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    this.template.set(attribute, date);
    if (this.template.startDate && this.template.endDate) {
      await this.template.validateProperty('startDate', {
        warnings: true,
      });
      await this.template.validateProperty('endDate', {
        warnings: true,
      });
      await validateTemplateDates(this.template, this.concept);
    }
  }
}
