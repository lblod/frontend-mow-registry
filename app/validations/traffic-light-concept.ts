import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  image: validatePresence({ presence: true, ignoreBlank: true }),
  definition: validatePresence({ presence: true, ignoreBlank: true }),
  meaning: validatePresence({ presence: true, ignoreBlank: true }),
  trafficLightConceptCode: validatePresence({
    presence: true,
    ignoreBlank: true,
  }),
};
