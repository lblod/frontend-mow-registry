import Service from '@ember/service';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import ENV from 'mow-registry/config/environment';

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
    let fileRecord = this.store.peekRecord('file', upload.data.id);
    let downloadUrl = fileRecord.downloadLink;
    // fileUrl is a relative url.
    // `ENV.baseUrl` is needed if the frontend and backend are not the same base url
    if (ENV.baseUrl) {
      downloadUrl = ENV.baseUrl + downloadUrl;
    }
    return downloadUrl;
  }
}
