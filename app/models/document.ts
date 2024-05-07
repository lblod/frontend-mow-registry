import Model from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    document: DocumentModel;
  }
}

export default class DocumentModel extends Model {}
