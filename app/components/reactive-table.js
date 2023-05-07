import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * @typedef {Object} Args
 * @property {string} noDataMessage
 * @property {string} fields
 *
 * @property {Record<string, unknown>} content
 * @property {number?} pageSize
 *
 * @property {number?} page
 * @property {string?} sort
 *
 *
 * @property {((newPage: number) => void)?} onPageChange
 * @property {((newSort: string) => void)?} onSortChange
 *
 */

/**
 * @extends {Component<Args>}
 * @property {Args} args
 */
export default class ReactiveTableComponent extends Component {
  @tracked _page;
  @tracked _sort;

  get pageSize() {
    return this.args.pageSize ?? 20;
  }

  get page() {
    return this.args.page ?? 0;
  }

  get sort() {
    return this.args.sort ?? '';
  }

  @action
  initialize() {
    this._page = this.page;
    this._sort = this.sort;
  }

  @action
  onPageChange() {
    if (this._page !== this.page) {
      this.args.onPageChange?.(this._page);
    }
  }

  @action
  onSortChange() {
    if (this._sort !== this.sort) {
      this.args.onSortChange?.(this._sort);
    }
  }

  @action
  onExternalPageChange() {
    if (this._page !== this.page) {
      this._page = this.page;
    }
  }

  @action
  onExternalSortChange() {
    if (this._sort !== this.sort) {
      this._sort = this.sort;
    }
  }
}
