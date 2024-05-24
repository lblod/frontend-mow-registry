import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    document: DocumentModel;
  }
}

export default class DocumentModel extends Model {
  @attr declare uri?: string;
}
