import { helper } from '@ember/component/helper';

type Item = {
  value: unknown;
};

export default helper(function findByValue([array, value]: [Item[], unknown]) {
  return array.find((item) => item.value === value);
});
