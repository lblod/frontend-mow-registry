import { helper } from '@ember/component/helper';

export default helper(function findByValue([array, value]) {
  return array.find((item) => item.value === value);
});
