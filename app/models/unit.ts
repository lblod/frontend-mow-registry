import Model from '@warp-drive/legacy/model';
import { attr } from '@warp-drive/legacy/model';
import type { Type } from '@warp-drive/core-types/symbols';

// TODO: Ideally this would come from the backend, but we'll hardcode the order for now.
const UNIT_ORDER = new Map([
  ['2f7dbc7c-fb21-4ff5-bb28-09bda87844b1', 1], // mm
  ['e84274d7-b6ff-43e7-8acb-1f76082967fa', 2], // cm
  ['f80b6ea1-438d-4155-a1ed-a938417d98b7', 3], // mm
  ['32a66efc-5285-4811-b1a4-de8e8d4e4598', 1], // °
]);

// TODO: Ideally this would come from the backend, but we'll hardcode them for now.
const DEFAULT_UNITS = [
  '2f7dbc7c-fb21-4ff5-bb28-09bda87844b1', // mm
  '32a66efc-5285-4811-b1a4-de8e8d4e4598', // °
];

export default class Unit extends Model {
  declare [Type]: 'unit';
  @attr declare symbol?: string;
  @attr declare label?: string;

  get order() {
    if (this.id && UNIT_ORDER.has(this.id)) {
      return UNIT_ORDER.get(this.id);
    } else {
      // Fallback, in case new units are added in the future,
      // should we throw an error in DEV so we are reminded to update the map?
      return 1;
    }
  }

  get isDefaultUnit() {
    if (!this.id) {
      return false;
    }

    return DEFAULT_UNITS.includes(this.id);
  }
}
