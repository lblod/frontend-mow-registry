import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TrafficMeasureIndexComponent extends Component {
  constructor(...args){
    super(...args);
    
    this.roadMeasure=this.args.roadMeasure
    this.roadMeasureSection=this.roadMeasure.roadMeasureSections.firstObject;
    
    this.new=this.args.new;
    
    if(!this.new){
      this.fetchData.perform();
    }
  }

  @service store;
  @service router;

  @tracked new;

  @tracked roadMeasure;
  @tracked roadMeasureSection;
  @tracked signs=[];
  @tracked variables=[];

  @tracked searchString;
  @tracked signError;
  @tracked template;
  @tracked variables = [];
  @tracked preview;
  @tracked model;
  @tracked inputTypes=[
    "text",
    "number",
    "date",
    "location",
    "codelist"
  ];

  get label(){
    let result='';
    this.signs.forEach(e=>result+=(e.roadSignConceptCode+"-"));
    result=result.slice(0, -1);
    return result+=' Traffic Measure';
  };

  @task 
  *fetchData(){
    this.template=this.roadMeasureSection.template;
    this.signs=(yield this.roadMeasure.roadSignConcepts).map(e=>e);
    this.variables=(yield this.roadMeasureSection.variables).map(e=>e);
    this.parseTemplate();
  }

  @task
  *addSign() {
    let result;
    result = yield this.store.query('road-sign-concept', {
      'filter[road-sign-concept-code]': this.searchString,
    });
    if (result.length == 0) {
      this.signError = "Couldn't find this sign";
    } else {
      this.signError = ' ';
      this.signs.pushObject(result.firstObject);
    }
  }

  //ui stuff
  @action
  updateSearchString(event) {
    this.searchString = event.target.value;
  }
  
  @action
  removeSign(sign) {
    this.signs.removeObject(sign);
  }
  
  @action 
  updateTemplate(event) {
    this.template = event.target.value;
  }

  //parsing algo
  @action
  parseTemplate() {
    //finds non-whitespase characters between ${ and }
    const regex = new RegExp(/\${(\S+?)}/g);
    const regexResult = [...this.template.matchAll(regex)];

    //remove duplicates from regex result
    const filteredRegexResult = [];
    regexResult.forEach((reg) => {
      if (!filteredRegexResult.find((fReg) => fReg[0] === reg[0])) {
        filteredRegexResult.push(reg);
      }
    });

    //remove non-existing variables
    this.variables = this.variables.filter((variable) => {
      return filteredRegexResult.find(
        (fReg) => fReg[1] === variable.label
      );
    });

    //add new variables
    filteredRegexResult.forEach((reg) => {
      if (
        !this.variables.find((variable) => variable.label === reg[1])
      ) {
        this.variables.pushObject({
          label: reg[1],
          type: 'text',
          roadMeasureSection: this.roadMeasureSection 
        });
      }
    });
    this.generatePreview();
  }
  
  @action 
  generatePreview() {
    this.preview = this.template;
    this.variables.forEach((e) => {
      let replaceString;
      if (e.type === 'text') {
        replaceString = "<input type='text'></input>";
      } else if (e.type === 'number') {
        replaceString = "<input type='number'></input>";
      } else if (e.type === 'date') {
        replaceString = "<input type='date'></input>";
      } else if (e.type === 'location') {
        replaceString = "<input type='text'></input>";
      } else if (e.type === 'codelist') {
        replaceString = "<input type='text'></input>";
      }
      this.preview = this.preview.replaceAll("${"+e.label+"}", replaceString);
    });
    this.generateModel();
  }

  @action 
  generateModel(){
    const templateUUid=this.roadMeasure.id;
    this.model=`
    PREFIX ex: <http://example.org#>
    PREFIX sh: <http://www.w3.org/ns/shacl#>
    PREFIX oslo: <http://data.vlaanderen.be/ns#>

    INSERT {
    GRAPH <http://mu.semte.ch/application>{
    
    ex:`+templateUUid+` a ex:TrafficMeasureTemplate ;
      ex:value "`+this.template+`";
      ex:mapping
    `;
    
    let varString="";
    this.variables.forEach(variable=>{
      varString+=`
        [
          ex:variable "`+variable.label+`" ;
          ex:expects [
            a sh:PropertyShape ;
              sh:targetClass ex:`+variable.type+` ;
              sh:maxCount 1 ;
          ]
        ],`;
    });
    varString=varString.slice(0, -1)+'.';
    

    let signString="";
    let signIdentifier="";
    this.signs.forEach(sign=>{
      signIdentifier+=sign.roadSignConceptCode+'-';
      signString+=`
        [
          a ex:MustUseRelation ;
          ex:signConcept <http://data.vlaanderen.be/id/concept/Verkeersbordconcept/`+sign.id+`> 
        ],`;
    });
    
    signString=signString.slice(0, -1);
    signIdentifier=signIdentifier.slice(0, -1);

    this.model+=varString+`

      ex:Shape#TrafficMeasure a sh:NodeShape;
        sh:targetClass oslo:Verkeersmaatregel;
        ex:targetHasConcept ex:`+signIdentifier+`MeasureConcept .
        
      ex:`+signIdentifier+`MeasureConcept a ex:Concept ;
        ex:label "`+signIdentifier+` traffic measure";
        ex:template ex:`+templateUUid+` ;
        ex:relation `;
    this.model+=signString+`.
    }}
    `;
  }

  @task 
  *delete(){
    yield this.roadMeasure.destroyRecord();
    this.router.transitionTo("traffic-measure-concepts.index");
  }

  @task 
  *save(){
    //1-parse everything again
    this.parseTemplate();

    //2-save road measure/section
    this.roadMeasure.label=this.label;
    this.roadMeasure.roadSignConcepts.pushObjects(this.signs);
    yield this.roadMeasure.save();
    this.roadMeasureSection.template=this.template;
    //if new make sure section is created
    if(this.new){
      yield this.roadMeasureSection.save(); 
    }   
    
    //3-handle variables
    yield this.roadMeasureSection.variables;
    //delete existing ones
    for (let i = 0; i < this.roadMeasureSection.variables.length; i++) {
      const variable = this.roadMeasureSection.variables.objectAt(i);
      yield variable.destroyRecord();
    }
    //create new ones
    for (let i = 0; i < this.variables.length; i++) {
      const variable = this.variables[i];
      const newVariable = yield this.store.createRecord('road-measure-variable');
      
      newVariable.label=variable.label;
      newVariable.type=variable.type;
      newVariable.roadMeasureSection=this.roadMeasureSection
      newVariable.save();
    }
    yield this.roadMeasureSection.save();

    //yield this.saveToDb.perform();

    if (this.new){
      this.router.transitionTo("traffic-measure-concepts.edit", this.roadMeasure.id);
    }
  }

  @task
  *saveToDb(){
    const response=yield fetch('http://localhost:8002/sparql/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: new URLSearchParams({query: this.model}).toString()
    });
    const result=yield response.json();
  }
}
