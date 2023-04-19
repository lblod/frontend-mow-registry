import Model, { attr } from '@ember-data/model';

export default class GroupModel extends Model {
  @attr declare name?: string;
}
