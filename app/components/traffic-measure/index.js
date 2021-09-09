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
  @tracked template;
  @tracked variables=[];
  @tracked preview;
  @tracked inputTypes=[
    "text",
    "number",
    "date",
    "location",
    "codelist"
  ];
  
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
  updateSearchString(event){
    this.searchString=event.target.value;
  }

  @action parseTemplate(){
    const regex = new RegExp(/\${(\S+?)}/g);
    const regexResult=[...this.template.matchAll(regex)];
    if(regexResult.length){
      regexResult.forEach(e=>{
        if(!this.variables.find(variable=>variable.varIdentifier===e[0])){
          this.variables.pushObject({
            varName: e[1],
            varIdentifier: e[0],
            varIdentifierIndex: e[2],
            varIdentifierLength: e[0].length,
            type: "text"
          })
        }
      });
    }
    this.generatePreview();
  }

  @action updateTemplate(event){
    this.template=event.target.value;
  }

  @action generatePreview(){
    this.preview=this.template;
    this.variables.forEach(e=>{
      let replaceString;
      if(e.type==='text'){
        replaceString="<input type='text'></input>"
      }
      else if(e. type==='number'){
        replaceString="<input type='number'></input>"
      }
      else if(e.type==='date'){
        replaceString="<input type='date'></input>";
      }
      else if(e.type==='location'){
        replaceString="<input type='text'></input>"
      }
      else if(e.type==='codelist'){
        replaceString="<input type='text'></input>";
      }
      this.preview=this.preview.replaceAll(e.varIdentifier, replaceString)
    });
  }
}
