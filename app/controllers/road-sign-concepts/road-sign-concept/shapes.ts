import Controller from '@ember/controller';
import { tracked } from 'tracked-built-ins';

export default class RoadSignConceptShapesController extends Controller {
  queryParams = ['pageNumber', 'sort'];

  pageSize = 20;
  @tracked pageNumber = 0;
  @tracked sort?: string = 'created-on';

  onPageChange = (newPage: number) => {
    this.pageNumber = newPage;
  };

  onSortChange = (newSort: string) => {
    this.sort = newSort;
  };
}
