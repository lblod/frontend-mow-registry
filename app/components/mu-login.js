import { tracked } from '@glimmer/tracking';
import MuLoginComponent from 'ember-mu-login/components/mu-login';

export default class MyMuLoginComponent extends MuLoginComponent {
  @tracked nickname;
  @tracked password;

  setNickname(event) {
    this.nickname = event.target.value;
  }

  setPassword(event){
    this.password = event.target.value;
  }
}
