import { attr, hasMany, belongsTo } from '@ember-data/model';
import ConceptModel from './concept';

export default class RoadSignConceptModel extends ConceptModel {
  @attr image;
  @attr meaning;
  @attr roadSignConceptCode;
  @belongsTo('road-sign-concept-status-code', {
    inverse: 'roadSignConcepts',
    async: true,
  })
  status;
  @hasMany('road-sign-category', { inverse: 'roadSignConcepts', async: true })
  categories;
  @hasMany('road-sign-concept', { inverse: 'mainSigns', async: true }) subSigns;
  @hasMany('road-sign-concept', { inverse: 'subSigns', async: true }) mainSigns;
  @belongsTo('skos-concept', { inverse: null, async: true }) zonality;
  @hasMany('road-sign-concept', {
    inverse: 'relatedFromRoadSignConcepts',
    async: true,
  })
  relatedToRoadSignConcepts;
  @hasMany('road-sign-concept', {
    inverse: 'relatedToRoadSignConcepts',
    async: true,
  })
  relatedFromRoadSignConcepts;
  @hasMany('road-marking-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  relatedRoadMarkingConcepts;
  @hasMany('traffic-light-concept', {
    inverse: 'relatedRoadSignConcepts',
    async: true,
  })
  relatedTrafficLightConcepts;
}
