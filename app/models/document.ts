import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    document: DocumentModel;
  }
}
