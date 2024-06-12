import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  image: validatePresence({ presence: true, ignoreBlank: true }),
  definition: validatePresence({ presence: true, ignoreBlank: true }),
  meaning: validatePresence({ presence: true, ignoreBlank: true }),
  label: validatePresence({
    presence: true,
    ignoreBlank: true,
  }),
};
