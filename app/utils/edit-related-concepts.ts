import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';

export type SomeConcept =
  | TrafficLightConceptModel
  | RoadSignConceptModel
  | RoadMarkingConceptModel;
/**
 * It's not pretty, but the datamodel is nonsense and doesn't really give us
 * much of a choice
 * @param mainConcept
 * @param refresh
 */
export const addRelated =
  (mainConcept: SomeConcept, refresh?: () => PromiseLike<void>) =>
  async (concept: SomeConcept) => {
    if (mainConcept instanceof TrafficLightConceptModel) {
      if (concept instanceof TrafficLightConceptModel) {
        mainConcept.relatedToTrafficLightConcepts.pushObject(concept);
      } else if (concept instanceof RoadMarkingConceptModel) {
        mainConcept.relatedRoadMarkingConcepts.pushObject(concept);
      } else {
        mainConcept.relatedRoadSignConcepts.pushObject(concept);
      }
    } else if (mainConcept instanceof RoadMarkingConceptModel) {
      if (concept instanceof TrafficLightConceptModel) {
        mainConcept.relatedTrafficLightConcepts.pushObject(concept);
      } else if (concept instanceof RoadMarkingConceptModel) {
        mainConcept.relatedToRoadMarkingConcepts.pushObject(concept);
      } else {
        mainConcept.relatedRoadSignConcepts.pushObject(concept);
      }
    } else {
      if (concept instanceof TrafficLightConceptModel) {
        mainConcept.relatedTrafficLightConcepts.pushObject(concept);
      } else if (concept instanceof RoadMarkingConceptModel) {
        mainConcept.relatedRoadMarkingConcepts.pushObject(concept);
      } else {
        mainConcept.relatedToRoadSignConcepts.pushObject(concept);
      }
    }
    await mainConcept.save();
    if (refresh) {
      await refresh();
    }
  };
export const removeRelated =
  (mainConcept: SomeConcept, refresh?: () => PromiseLike<void>) =>
  async (concept: SomeConcept) => {
    if (mainConcept instanceof TrafficLightConceptModel) {
      if (concept instanceof TrafficLightConceptModel) {
        mainConcept.relatedToTrafficLightConcepts.removeObject(concept);
      } else if (concept instanceof RoadMarkingConceptModel) {
        mainConcept.relatedRoadMarkingConcepts.removeObject(concept);
      } else {
        mainConcept.relatedRoadSignConcepts.removeObject(concept);
      }
    } else if (mainConcept instanceof RoadMarkingConceptModel) {
      if (concept instanceof TrafficLightConceptModel) {
        mainConcept.relatedTrafficLightConcepts.removeObject(concept);
      } else if (concept instanceof RoadMarkingConceptModel) {
        mainConcept.relatedToRoadMarkingConcepts.removeObject(concept);
      } else {
        mainConcept.relatedRoadSignConcepts.removeObject(concept);
      }
    } else {
      if (concept instanceof TrafficLightConceptModel) {
        mainConcept.relatedTrafficLightConcepts.removeObject(concept);
      } else if (concept instanceof RoadMarkingConceptModel) {
        mainConcept.relatedRoadMarkingConcepts.removeObject(concept);
      } else {
        mainConcept.relatedToRoadSignConcepts.removeObject(concept);
      }
    }
    await mainConcept.save();
    if (refresh) {
      await refresh();
    }
  };
