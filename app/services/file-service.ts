import Store from 'ember-data/store';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import type FileModel from 'mow-registry/models/file';

type Response = {
  data: {
    id: string;
  };
};
export default class FileService extends Service {
  @service declare store: Store;

  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/files', {
      method: 'POST',
      body: formData,
    });
    const upload = (await response.json()) as Response;
    this.store.pushPayload('file', upload);
    const fileRecord = this.store.peekRecord<FileModel>('file', upload.data.id);
    if (!fileRecord) {
      throw Error(`Failed upload file`);
    }
    return fileRecord;
  }
}
