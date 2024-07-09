import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import SkosConcept from 'mow-registry/models/skos-concept';
import FileModel from 'mow-registry/models/file';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    icon: Icon;
  }
}
export default class Icon extends SkosConcept {
  @belongsTo('file', {
    async: true,
  })
  declare image: AsyncBelongsTo<FileModel>;
}
