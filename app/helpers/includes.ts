import { helper } from '@ember/component/helper';

export function includes([label, ...labelsList]: [
  string,
  ...string[],
]): boolean {
  return labelsList.includes(label);
}

export default helper(includes);
