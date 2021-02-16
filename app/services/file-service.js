import Service from '@ember/service';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class FileServiceService extends Service {
  @service store;

  async upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/files', {
      method: 'POST',
      body: formData,
    });
    const upload = await response.json();
    this.store.pushPayload('file', upload);
    return this.store.peekRecord('file', upload.data.id);
  }
}
