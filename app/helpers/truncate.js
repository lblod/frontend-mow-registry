import { helper } from '@ember/component/helper';

export default helper(function truncate([string]) {
  string = string.replace(/\n/g, '');
  if (string.length > 40) {
    string = string.substring(0, 40);
    string = string + '...';
  }
  return string;
});
