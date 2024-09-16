import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AddInstructionComponent extends Component {
  @service store;
  @service router;
  @service('codelists') codeListService;
  @service intl;
  @tracked template;
  @tracked concept;
  @tracked variables;
  @tracked codeLists;
  @tracked new;
  @tracked inputTypes = ['text', 'number', 'date', 'location', 'codelist'];

  variablesToBeDeleted = [];

  @action
  async didInsert() {
    this.fetchData.perform();
  }

  fetchData = task(async () => {
    this.concept = await this.args.concept;
    this.codeLists = await this.codeListService.all.perform();

    if (this.args.editedTemplate) {
      this.new = false;
      this.template = await this.args.editedTemplate;
      this.variables = await this.template.variables;
      this.variables = this.variables
        .slice()
        .sort((a, b) => (a.id < b.id ? -1 : 1));
    } else {
      this.new = true;
      this.template = this.store.createRecord('template');
      this.template.value = '';
      this.variables = await this.template.variables;
    }
    this.parseTemplate();
  });

  @action
  async updateVariableType(variable, type) {
    variable.type = type;
    if (type === 'codelist' && !(await variable.codeList)) {
      variable.codeList = this.codeLists[0];
    } else {
      variable.codeList = null;
    }
  }

  @action
  updateCodeList(variable, codeList) {
    variable.codeList = codeList;
  }

  @action
  updateTemplate(event) {
    this.template.value = event.target.value;
    this.parseTemplate();
  }

  get templateSyntaxError() {
    if (!this.template || !this.template.value) {
      return null;
    }
    // Regex which tests if variables in the template occur containing non-allowed characters:
    // (characters which are not: letters, numbers, '-', '.', '_', '}')
    const regex = new RegExp(/\${[^}]*?[^a-zA-Z\d\-_.}]+?[^}]*?}/g);
    const containsInvalidCharacters = regex.test(this.template.value);

    if (containsInvalidCharacters) {
      return {
        title: this.intl.t(
          'utility.template-variables.invalid-character.title',
        ),
        message: this.intl.t(
          'utility.template-variables.invalid-character.message',
        ),
      };
    }
    return null;
  }

  //only resetting things we got from parent component
  @action
  reset() {
    if (this.template.hasDirtyAttributes || this.template.isNew) {
      this.template.rollbackAttributes();
    }
    if (this.concept.hasDirtyAttributes || this.concept.isNew) {
      this.concept.rollBackAttributes();
    }
    if (this.args.closeInstructions) {
      this.args.closeInstructions();
    } else if (this.args.from) {
      this.router.transitionTo(this.args.from);
    }
  }

  @action
  parseTemplate() {
    //match "a-z", "A-Z", "-", "_", "." and "any digit characters" between ${ and } lazily
    const regex = new RegExp(/\${([a-zA-Z\-_.\d]+?)}/g);
    const regexResult = [...this.template.value.matchAll(regex)];

    //remove duplicates from regex result
    const filteredRegexResult = [];
    regexResult.forEach((reg) => {
      if (!filteredRegexResult.find((fReg) => fReg[0] === reg[0])) {
        filteredRegexResult.push(reg);
      }
    });

    //remove non-existing variable variables from current array
    //turns variables into a non ember data thing
    this.variables = this.variables.filter((variable) => {
      //search regex results if they contain this variable
      if (
        filteredRegexResult.find((fReg) => {
          if (fReg[1] === variable.value) {
            return true;
          }
        })
      ) {
        return true;
      } else {
        this.variablesToBeDeleted.push(variable);
      }
    });

    //add new variable values
    filteredRegexResult.forEach((reg) => {
      if (!this.variables.find((variable) => variable.value === reg[1])) {
        const variable = this.store.createRecord('variable', {
          value: reg[1],
          type: 'text',
        });
        this.variables.push(variable);
      }
    });

    //remove duplicates in case something went wrong
    const filteredVariables = [];
    this.variables.forEach((variable) => {
      if (
        !filteredVariables.find(
          (fVariable) => fVariable.value === variable.value,
        )
      ) {
        filteredVariables.push(variable);
      } else {
        this.variablesToBeDeleted.push(variable);
      }
    });

    //sort variables in the same order as the regex result
    const sortedVariables = [];
    filteredRegexResult.forEach((reg) => {
      filteredVariables.forEach((variable) => {
        if (reg[1] == variable.value) {
          sortedVariables.push(variable);
        }
      });
    });

    //check existing default variables with deleted non-default variables and swap them
    sortedVariables.forEach((sVariable, sI) => {
      this.variablesToBeDeleted.forEach((dVariable, dI) => {
        if (sVariable.value === dVariable.value) {
          if (dVariable.type !== 'text' && sVariable.type === 'text') {
            sortedVariables.replace(sI, 1, [dVariable]);
            this.variablesToBeDeleted.replace(dI, 1, [sVariable]);
          }
        }
      });
    });

    this.variables = sortedVariables;
  }

  get canSave() {
    return !this.save.isRunning && !this.templateSyntaxError;
  }

  save = task(async () => {
    await this.template.save();
    (await this.concept.hasInstructions).push(this.template);
    await this.concept.save();
    for (let i = 0; i < this.variables.length; i++) {
      const variable = this.variables[i];
      (await this.template.variables).push(variable);
      await variable.save();
    }
    // New datamodel misses relationship for rdfA notation
    // this.template.value = await includeVariables(
    //   this.template.value,
    //   this.variables,
    // );
    await this.template.save();
    await Promise.all(
      this.variablesToBeDeleted.map((variable) => variable.destroyRecord()),
    );

    this.reset();
  });
}
