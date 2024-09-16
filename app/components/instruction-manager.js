import AddInstruction from './add-instruction';
import { task } from 'ember-concurrency';
import { removeItem } from 'mow-registry/utils/array';

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
}
