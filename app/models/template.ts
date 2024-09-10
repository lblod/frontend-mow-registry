import {
  attr,
  hasMany,
  belongsTo,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import TrafficMeasureConceptModel from './traffic-measure-concept';
import DocumentModel from './document';
import VariableModel from './variable';

export default class TemplateModel extends DocumentModel {
  //@ts-expect-error TS doesn't allow subclasses to redefine concrete types. We should try to remove the inheritance chain.
  declare [Type]: 'template';
  @attr declare value?: string;

  @hasMany('variable', { inverse: null, async: true })
  declare variables: AsyncHasMany<VariableModel>;

  @belongsTo('traffic-measure-concept', {
    inverse: 'template',
    async: true,
  })
  declare parentConcept: AsyncBelongsTo<TrafficMeasureConceptModel>;
}
