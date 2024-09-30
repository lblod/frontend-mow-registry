import EmberRouter from '@embroider/router';
import config from 'mow-registry/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('sparql');
  this.route('login');
  this.route('mock-login');
  this.route('road-sign-concepts', function () {
    this.route('road-sign-concept', { path: '/:id' }, function () {
      this.route('instruction', { path: '/instruction//:instruction_id' });
      this.route('instructions', function () {
        this.route('edit', { path: '/:instructionId' });
      });
      this.route('main-signs');
      this.route('sub-signs');
      this.route('related');
    });
    this.route('new');
    this.route('edit', { path: '/edit/:id' });
  });
  this.route('road-marking-concepts', function () {
    this.route('road-marking-concept', { path: '/:id' }, function () {
      this.route('instructions', function () {
        this.route('edit', { path: '/:instructionId' });
      });
      this.route('related');
    });
    this.route('new');
    this.route('edit', { path: '/edit/:id' });
  });
  this.route('traffic-light-concepts', function () {
    this.route('traffic-light-concept', { path: '/:id' }, function () {
      this.route('instructions', function () {
        this.route('edit', { path: '/:instructionId' });
      });
      this.route('related');
    });
    this.route('new');
    this.route('edit', { path: '/edit/:id' });
  });
  this.route('traffic-measure-concepts', function () {
    this.route('edit', { path: '/edit/:id' });
    this.route('new');
    this.route('traffic-measure-concept', { path: '/:id' });
  });
  this.route('instruction', function () {
    this.route('new');
    this.route('edit');
  });
  this.route('edit-instruction');
  this.route('codelists-management', function () {
    this.route('new');
    this.route('edit', { path: '/edit/:id' });
    this.route('codelist', { path: '/:id' });
  });
  this.route('icon-catalog', function () {
    this.route('new');
    this.route('edit', { path: '/edit/:id' });
    this.route('icon', { path: '/:id' });
  });
  this.route('authorization', function () {
    this.route('callback');
  });
});
