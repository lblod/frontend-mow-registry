import MuLoginComponent from 'ember-mu-login/components/mu-login';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyMuLoginComponent extends MuLoginComponent {
  @tracked nickname = '';
  @tracked password = '';

  @action
  setNickname(roadSignConcept, event) {
    this.nickname = event.target.value;
  }

  @action
  setPassword(roadSignConcept, event) {
    this.password = event.target.value;
  }
}
