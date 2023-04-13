import { hasMany, belongsTo } from '@ember-data/model';
import ConceptSchemeModel from './concept-scheme';

export default class CodeListModel extends ConceptSchemeModel {
  @hasMany('mapping', { inverse: 'codeList', async: true }) mappings;
  @belongsTo('skos-concept', { inverse: null, async: true }) type;
}
