import {
  validateLength,
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  // image: validatePresence({ presence: true, ignoreBlank: true }),
  meaning: validatePresence({ presence: true, ignoreBlank: true }),
  label: validatePresence({ presence: true, ignoreBlank: true }),
  classifications: validateLength({ min: 1 }),
  shape: validatePresence({ presence: true, ignoreBlank: true }),
  // dimensions: validatePresence({ presence: true, ignoreBlank: true }),
};
