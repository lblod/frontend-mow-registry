import Store from 'ember-data/store';
import type { StableRecordIdentifier } from '@warp-drive/core-types/identifier';

export default class extends Store {
  instantiateRecord(id: StableRecordIdentifier, args: Record<string, unknown>) {
    if (id.type === 'text-variable') {
      args['type'] = 'text';
    } else if (id.type === 'number-variable') {
      args['type'] = 'number';
    } else if (id.type === 'date-variable') {
      args['type'] = 'date';
    } else if (id.type === 'location-variable') {
      args['type'] = 'location';
    } else if (id.type === 'codelist-variable') {
      args['type'] = 'codelist';
    } else if (id.type === 'instruction-variable') {
      args['type'] = 'instruction';
    }
    return super.instantiateRecord(id, args);
  }
}
