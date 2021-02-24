import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'mow-registry/config/environment';

export default class ApplicationRoute extends Route {
  @service intl;

  model({ lang }) {
    const supportedLocales = config.supportedLocales;
    let defaultLocale =
      supportedLocales[lang] !== undefined
        ? supportedLocales[lang]
        : config.defaultLocale;

    this.intl.setLocale([defaultLocale]);
  }
}
