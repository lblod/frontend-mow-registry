import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type shapeDimension,
  type Shape,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type IntlService from 'ember-intl/services/intl';

export default class HeightAndWidhtShape implements Shape {
  height: shapeDimension;
  width: shapeDimension;
  shape: TribontShape;
  constructor(
    shape: TribontShape,
    height: shapeDimension,
    width: shapeDimension,
  ) {
    this.height = height;
    this.width = width;
    this.shape = shape;
  }
  toString(intl: IntlService) {
    return `${intl.t('shape-manager.height')}: ${this.height.value} ${this.height.unit.symbol} ${intl.t('shape-manager.width')}: ${this.width.value} ${this.width.unit.symbol}`;
  }
  get unitMeasure() {
    return this.height.unit;
  }

  get id() {
    return this.shape.id as string;
  }

  static headers(intl: IntlService) {
    return [
      {
        label: intl.t('shape-manager.height'),
        value: 'height',
      },
      {
        label: intl.t('shape-manager.width'),
        value: 'width',
      },
    ];
  }

  static async fromShape(shape: TribontShape) {
    if (!shape.id) return;
    const dimensions = await shape.dimensions;
    const heightDimension = dimensions.find(
      (dimension) => dimension.kind.uri === DIMENSIONS.height,
    );

    const widthDimension = dimensions.find(
      (dimension) => dimension.kind.uri === DIMENSIONS.width,
    );
    if (!heightDimension || !widthDimension) return;
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }

  async convertToNewUnit(unit: Unit) {
    this.height.unit = unit;
    this.width.unit = unit;
    this.height.dimension.set('unit', unit);
    await this.height.dimension.save();
    this.width.dimension.set('unit', unit);
    await this.width.dimension.save();
  }

  async validateAndsave() {
    const heightValid = await this.height.dimension.validate();
    const widthValid = await this.width.dimension.validate();
    const shapeValid = await this.shape.validate();
    if (heightValid && widthValid && shapeValid) {
      await this.height.dimension.save();
      await this.width.dimension.save();
      await this.shape.save();
      return true;
    }
    return false;
  }

  async reset() {
    this.height.dimension.rollbackAttributes();
    this.width.dimension.rollbackAttributes();
    this.height = await dimensionToShapeDimension(
      this.height.dimension,
      'height',
    );
    this.width = await dimensionToShapeDimension(this.width.dimension, 'width');
    this.shape.rollbackAttributes();
  }
  async remove() {
    this.height.dimension.deleteRecord();
    this.width.dimension.deleteRecord();
    await this.height.dimension.save();
    await this.width.dimension.save();
    this.shape.deleteRecord();
    await this.shape.save();
  }
}
