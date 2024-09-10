import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Store from '@ember-data/store';
import TribontShapeClassificationCode from 'mow-registry/models/tribont-shape-classification-code';
import ApplicationInstance from '@ember/application/instance';
import QuantityKind from 'mow-registry/models/quantity-kind';
import Unit from 'mow-registry/models/unit';
import TribontShape from 'mow-registry/models/tribont-shape';
import Dimension from 'mow-registry/models/dimension';

type Args = {
  onNewShape: (shape: TribontShape) => void;
  quantityKinds: QuantityKind[];
};

export default class RoadSignShapeSelectComponent extends Component<Args> {
  @service declare store: Store;
  @tracked showDimensionForm = false;
  @tracked showShapeForm = false;
  @tracked shape: TribontShape;
  @tracked dimension: Dimension;

  constructor(owner: ApplicationInstance, args: Args) {
    super(owner, args);
    this.shape = this.store.createRecord<TribontShape>('tribont-shape', {});
    this.dimension = this.store.createRecord<Dimension>('dimension', {});
  }
  @action
  setClassificatie(classificatie: TribontShapeClassificationCode) {
    this.shape.set('classification', classificatie);
    this.dimension = this.store.createRecord<Dimension>('dimension', {});
  }

  @action
  setQuantityKind(qt: QuantityKind) {
    this.dimension.set('kind', qt);
    this.dimension.set('unit', undefined);
  }

  @action
  setUnitType(u: Unit) {
    this.dimension.set('unit', u);
  }

  @action
  async addDimension() {
    await this.dimension.validate();
    if (!this.dimension.error) {
      (await this.shape.dimensions).push(this.dimension);
      this.dimension = this.store.createRecord<Dimension>('dimension', {});
      this.showDimensionForm = false;
    }
  }

  setDimensionValue = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).valueAsNumber;
    if (!isNaN(newValue)) {
      this.dimension.value = newValue;
    } else {
      // This forces the error state if the user entered a non-number value
      this.dimension.value = undefined;
    }
  };

  @action
  async saveShape() {
    await this.shape.validate();
    if (!this.shape.error) {
      this.args.onNewShape(this.shape);
      this.shape = this.store.createRecord<TribontShape>('tribont-shape', {});
      this.showShapeForm = false;
    }
  }
}
