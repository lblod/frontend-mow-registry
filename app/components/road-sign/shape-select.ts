import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Store from '@ember-data/store';
import TribontShapeClassificatieCodeModel from 'mow-registry/models/tribont-shape-classificatie-code';
import ApplicationInstance from '@ember/application/instance';
import QuantityKindModel from 'mow-registry/models/quantity-kind';
import UnitModel from 'mow-registry/models/unit';
import TribontShapeModel from 'mow-registry/models/tribont-shape';
import DimensionModel from 'mow-registry/models/dimension';

type Args = {
  onNewShape: (shape: TribontShapeModel) => void;
  quantityKinds: QuantityKindModel[];
};

export default class RoadSignShapeSelectComponent extends Component<Args> {
  @service declare store: Store;
  @tracked showDimensionForm = false;
  @tracked showShapeForm = false;
  @tracked shape: TribontShapeModel;
  @tracked dimension: DimensionModel;

  constructor(owner: ApplicationInstance, args: Args) {
    super(owner, args);
    this.shape = this.store.createRecord('tribont-shape');
    this.dimension = this.store.createRecord('dimension');
  }
  @action
  setClassificatie(classificatie: TribontShapeClassificatieCodeModel) {
    this.shape.set('classification', classificatie);
    this.dimension = this.store.createRecord('dimension');
  }

  @action
  setQuantityKind(qt: QuantityKindModel) {
    this.dimension.set('kind', qt);
    this.dimension.set('unit', undefined);
  }

  @action
  setUnitType(u: UnitModel) {
    this.dimension.set('unit', u);
  }

  @action
  async addDimension() {
    await this.dimension.validate();
    if (!this.dimension.error) {
      (await this.shape.dimensions).pushObject(this.dimension);
      this.dimension = this.store.createRecord('dimension');
      this.showDimensionForm = false;
    }
  }
  @action
  async saveShape() {
    await this.shape.validate();
    if (!this.shape.error) {
      this.args.onNewShape(this.shape);
      this.shape = this.store.createRecord('tribont-shape');
      this.showShapeForm = false;
    }
  }
}
