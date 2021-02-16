import Service from '@ember/service';

export default class FileServiceService extends Service {
  async upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/files', {
      method: 'POST',
      body: formData,
    });
    const upload = await response.json();
    return `/files/${upload.data.id}/download`;
  }
}
