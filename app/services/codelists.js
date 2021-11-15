import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CodelistsService extends Service {
  constructor(...args){
    super(...args);
    this.fetchCodelists.perform();
    
  }
  
  @tracked all;

  @service store;
  
  @task 
  *fetchCodelists(){
    this.all=yield this.store.findAll('code-list');
    
    for (let i = 0; i < this.all.length; i++) {
      const codeList = this.all.objectAt(i);
      yield codeList.codeListOptions;
    }

  }
}
