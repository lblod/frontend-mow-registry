import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type Shape,
  type shapeDimension,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type IntlService from 'ember-intl/services/intl';

export default class WidthShape implements Shape {
  width: shapeDimension;
  shape: TribontShape;
  constructor(shape: TribontShape, width: shapeDimension) {
    this.width = width;
    this.shape = shape;
  }
  toString(intl: IntlService) {
    return `${intl.t('shape-manager.width')}: ${this.width.value} ${this.width.unit.symbol}`;
  }
  get unitMeasure() {
    return this.width.unit;
  }

  get id() {
    return this.shape.id as string;
  }

  static headers(intl: IntlService) {
    return [
      {
        label: intl.t('shape-manager.width'),
        value: 'width',
      },
    ];
  }

  static async fromShape(shape: TribontShape) {
    if (!shape.id) return;
    const dimensions = await shape.dimensions;
    const widthDimension = dimensions.find(
      (dimension) => dimension.kind?.uri === DIMENSIONS.width,
    );
    if (!widthDimension) return;
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }

  async convertToNewUnit(unit: Unit) {
    this.width.unit = unit;
    this.width.dimension.set('unit', unit);
    await this.width.dimension.save();
  }

  async validateAndsave() {
    const widthValid = await this.width.dimension.validate();
    const shapeValid = await this.shape.validate();
    if (widthValid && shapeValid) {
      await this.width.dimension.save();
      await this.shape.save();
      return true;
    }
    return false;
  }

  async reset() {
    this.width.dimension.reset();
    this.width = await dimensionToShapeDimension(this.width.dimension, 'width');
    this.shape.reset();
  }
  async remove() {
    this.width.dimension.deleteRecord();
    await this.width.dimension.save();
    this.shape.deleteRecord();
    await this.shape.save();
  }
}
