import {
  validateLength,
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  // image: validatePresence({ presence: true, ignoreBlank: true }),
  meaning: validatePresence({ presence: true, ignoreBlank: true }),
  code: validatePresence({ presence: true, ignoreBlank: true }),
  classifications: validateLength({ min: 1 }),
  shapes: validatePresence({ presence: true, ignoreBlank: true }),
};
