import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Args = {
  pageSize?: number;
  page?: number;
  sort?: string;

  onPageChange?: (newPage: number) => void;
  onSortChange?: (newSort: string) => void;
};
export default class ReactiveTableComponent extends Component<Args> {
  @tracked declare _page: number;
  @tracked declare _sort: string;

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
