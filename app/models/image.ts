import { attr } from '@ember-data/model';
import DocumentModel from 'mow-registry/models/document';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    image: ImageModel;
  }
}

export default class ImageModel extends DocumentModel {
  // @attr declare uri?: string;
}