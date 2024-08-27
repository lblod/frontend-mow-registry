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

type Args = {
  onNewShape: (shape: TribontShapeModel) => void;
  quantityKinds: QuantityKindModel[];
};

export default class RoadSignShapeSelectComponent extends Component<Args> {
  @service declare store: Store;
  @tracked quantityKind?: QuantityKindModel;
  @tracked unitType?: UnitModel;
  @tracked showDimensionForm = false;
  @tracked showShapeForm = false;
  @tracked shape: TribontShapeModel;

  @tracked value?: number;
  constructor(owner: ApplicationInstance, args: Args) {
    super(owner, args);
    this.shape = this.store.createRecord('tribont-shape');
  }
  @action
  setClassificatie(classificatie: TribontShapeClassificatieCodeModel) {
    this.shape.set('classification', classificatie);
    this.quantityKind = undefined;
    this.unitType = undefined;
  }

  @action
  setQuantityKind(qt: QuantityKindModel) {
    this.quantityKind = qt;
    this.unitType = undefined;
  }

  @action
  setUnitType(u: UnitModel) {
    this.unitType = u;
  }

  @action
  addDimension() {
    // fixme the dimension could be on its own component probably
    if (this.quantityKind && this.unitType && this.value) {
      const dimension = this.store.createRecord('dimension', {
        value: this.value,
        unit: this.unitType,
        kind: this.quantityKind,
      });
      this.shape.dimensions.pushObject(dimension);

      this.quantityKind = undefined;
      this.unitType = undefined;
      this.value = undefined;
      this.showDimensionForm = false;
    }
  }
  @action
  saveShape() {
    this.args.onNewShape(this.shape);
    this.shape = this.store.createRecord('tribont-shape');
    this.showShapeForm = false;
  }
}
