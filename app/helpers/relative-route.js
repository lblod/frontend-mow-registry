import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';

export default class RelativeRoute extends Helper {
  @service router;
  compute([path]) {
    const fullPath = this.router.currentRoute.name;
    const removeableEnd = '.index';
    const basePath = fullPath.endsWith(removeableEnd)
      ? fullPath.slice(0, -removeableEnd.length)
      : fullPath;

    return basePath + '.' + path;
  }
}
