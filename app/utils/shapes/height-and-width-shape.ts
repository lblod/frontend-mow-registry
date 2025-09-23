import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type shapeDimension,
  type Shape,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type IntlService from 'ember-intl/services/intl';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import type { Store } from '@warp-drive/core';

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
      (dimension) => dimension.kind?.uri === DIMENSIONS.height,
    );

    const widthDimension = dimensions.find(
      (dimension) => dimension.kind?.uri === DIMENSIONS.width,
    );
    if (!heightDimension || !widthDimension) return;
    const height = await dimensionToShapeDimension(heightDimension, 'height');
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, height, width);
  }

  async convertToNewUnit(unit: Unit, store: Store) {
    this.height.unit = unit;
    this.width.unit = unit;
    this.height.dimension.set('unit', unit);
    await store.request(saveRecord(this.height.dimension));
    this.width.dimension.set('unit', unit);
    await store.request(saveRecord(this.width.dimension));
  }

  async validateAndsave(store: Store) {
    const heightValid = await this.height.dimension.validate();
    const widthValid = await this.width.dimension.validate();
    const shapeValid = await this.shape.validate();
    if (heightValid && widthValid && shapeValid) {
      await store.request(saveRecord(this.height.dimension));
      await store.request(saveRecord(this.width.dimension));
      await store.request(saveRecord(this.shape));
      return true;
    }
    return false;
  }

  async reset() {
    this.height.dimension.reset();
    this.width.dimension.reset();
    this.height = await dimensionToShapeDimension(
      this.height.dimension,
      'height',
    );
    this.width = await dimensionToShapeDimension(this.width.dimension, 'width');
    this.shape.reset();
  }
  async remove(store: Store) {
    this.height.dimension.deleteRecord();
    this.width.dimension.deleteRecord();
    await store.request(saveRecord(this.height.dimension));
    await store.request(saveRecord(this.width.dimension));

    this.shape.deleteRecord();
    await store.request(saveRecord(this.shape));
  }
}
