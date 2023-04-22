import Route from '@ember/routing/route';

export default class ConceptRoute extends Route {
  get parentRoute() {
    return this.routeName.substring(0, this.routeName.lastIndexOf('.'));
  }
}
