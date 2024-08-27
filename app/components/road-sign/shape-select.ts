import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import TribontShapeModel from 'mow-registry/models/tribont-shape';
import Store from '@ember-data/store';
import TribontShapeClassificatieCodeModel from 'mow-registry/models/tribont-shape-classificatie-code';
import ApplicationInstance from '@ember/application/instance';
import QuantityKindModel from 'mow-registry/models/quantity-kind';
import DimensionModel from 'mow-registry/models/dimension';
import UnitModel from 'mow-registry/models/unit';
type Args = {
  onNewShape: (shape: TribontShapeModel) => void;
  shape?: TribontShapeModel;
  quantityKinds: QuantityKindModel[];
};

export default class RoadSignShapeSelectComponent extends Component<Args> {
  @service declare store: Store;
  @tracked classificatie?: TribontShapeClassificatieCodeModel;
  @tracked quantityKind?: QuantityKindModel;
  @tracked unitType?: UnitModel;
  @tracked dimensions: DimensionModel[] = [];
  @tracked showDimensionForm = false;

  @tracked value?: number;
  constructor(owner: ApplicationInstance, args: Args) {
    super(owner, args);
    if (this.args.shape) {
      // todo initialize tracked stuff
    }
  }
  @action
  setClassificatie(classificatie: TribontShapeClassificatieCodeModel) {
    this.classificatie = classificatie;
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
        quantityKind: this.quantityKind,
      });

      this.dimensions = [...this.dimensions, dimension];
      this.quantityKind = undefined;
      this.unitType = undefined;
      this.value = undefined;
      this.showDimensionForm = false;
    }
    console.log(this.dimensions);
  }
}
