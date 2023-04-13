import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  label: validatePresence({ presence: true, ignoreBlank: true }),
  temporal: validatePresence({ presence: true, ignoreBlank: true }),
};
