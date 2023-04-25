import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import ConceptModel from 'mow-registry/models/concept';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

interface Args {
  concept: ConceptModel;
  relatedSigns: RoadSignConceptModel[];
  relatedMarkings: RoadMarkingConceptModel[];
  relatedLights: TrafficLightConceptModel[];
}

export default class ConceptIndexPageComponent extends Component<Args> {
  show = {};

  get concept() {
    return this.args.concept;
  }

  removeTemplate = task(async (template) => {
    let templates = await this.concept.templates;

    templates.removeObject(template);

    await template.destroyRecord();
    await this.concept.save();
  });
}
