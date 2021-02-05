import EmberRouter from '@ember/routing/router';
import config from 'mow-registry/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('roadsign-concepts', function () {
    this.route('roadsign-concept', { path: '/:id' });
    this.route('new');
    this.route('edit', { path: '/edit/:id' });
  });
  this.route('measure-concepts', function () {
    this.route('measure-concept', { path: '/:id' });
    this.route('new');
  });
});
