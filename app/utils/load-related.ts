import ConceptModel from 'mow-registry/models/concept';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import Store from '@ember-data/store';

export type RoadConcept =
  | RoadMarkingConceptModel
  | RoadSignConceptModel
  | TrafficLightConceptModel;

export async function loadInstructions(
  store: Store,
  concept: ConceptModel,
  id: string
) {
  if (id === 'new') {
    let template = store.createRecord('template');
    template.value = '';
    concept.templates.pushObject(template);
    return {
      template,
      mainConcept: concept,
    };
  } else {
    const template = await store.findRecord('template', id, {
      include: 'mappings',
    });
    return {
      template,
      mainConcept: concept,
    };
  }
}
