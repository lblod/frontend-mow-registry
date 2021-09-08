import Component from '@glimmer/component';
import { task } from "ember-concurrency";
import { tracked } from "@glimmer/tracking";
import {action} from '@ember/object';
import { inject as service } from '@ember/service';
export default class TrafficMeasureIndexComponent extends Component {
  @service store;
  
  @tracked signs=[];
  @tracked searchString;
  @tracked error;
  @tracked content=[];
  @tracked selectedType=this.itemTypes[0];
  @tracked itemTypes=[
    "Constant: Text",
    "Variable: Location",
    "Variable: Number",
    "Variable: Text"
  ];
  @tracked tempText;

  @task
  *addSign(){
    let result;
    result=yield this.store.query('road-sign-concept', {
      'filter[road-sign-concept-code]': this.searchString
    })
    if(result.length==0){
      this.error="Couldn't find this sign";    
    }
    else{
      this.error=" "
      this.signs.pushObject(result.firstObject)
    }
  }

  @action 
  addSection(){
    this.content.pushObject([]);
  }
  
  @action 
  addItem(section){
    
    if(this.selectedType=="Constant: Text"){
      section.pushObject({
        type: this.selectedType,
        content: this.tempText
      });
    }
    else{
      section.pushObject({
        type: this.selectedType,
        content: null
      });
    }
    this.tempText=null;
  }

  @action
  updateSearchString(event){
    this.searchString=event.target.value;
  }

  @action
  updateTempText(event){
    this.tempText=event.target.value;
  }
}
