import Store from '@ember-data/store';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import ENV from 'mow-registry/config/environment';

type Response = {
  data: {
    id: string;
  };
};
export default class FileService extends Service {
  @service declare store: Store;

  async upload(fileName: string) {
    const formData = new FormData();
    formData.append('file', fileName);
    const response = await fetch('/files', {
      method: 'POST',
      body: formData,
    });
    const upload = (await response.json()) as Response;
    this.store.pushPayload('file', upload);
    const fileRecord = this.store.peekRecord('file', upload.data.id);
    if (!fileRecord) {
      throw Error(`Failed upload file: ${fileName}`);
    }
    let downloadUrl = fileRecord.downloadLink;
    // fileUrl is a relative url.
    // `ENV.baseUrl` is needed if the frontend and backend are not the same base url
    if (ENV.baseUrl) {
      downloadUrl = ENV.baseUrl + downloadUrl;
    }
    return downloadUrl;
  }
}
