import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  image: validatePresence({ presence: true, ignoreBlank: true }),
  meaning: validatePresence({ presence: true, ignoreBlank: true }),
  roadMarkingConceptCode: validatePresence({
    presence: true,
    ignoreBlank: true,
  }),
};
