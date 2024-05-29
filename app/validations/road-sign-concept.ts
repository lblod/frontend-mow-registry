import {
  validateLength,
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  image: validatePresence({ presence: true, ignoreBlank: true }),
  meaning: validatePresence({ presence: true, ignoreBlank: true }),
  roadSignConceptCode: validatePresence({ presence: true, ignoreBlank: true }),
  categories: validateLength({ min: 1 }),
  shapes: validatePresence({ presence: true, ignoreBlank: true }),
};
