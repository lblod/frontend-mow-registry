import type TribontShape from 'mow-registry/models/tribont-shape';
import {
  DIMENSIONS,
  dimensionToShapeDimension,
  type Shape,
  type ShapeDimension,
} from '.';
import type Unit from 'mow-registry/models/unit';
import type IntlService from 'ember-intl/services/intl';
import type { Store } from '@warp-drive/core';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

export default class WidthShape implements Shape {
  width: ShapeDimension;
  shape: TribontShape;
  protected constructor(shape: TribontShape, width: ShapeDimension) {
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
    if (!shape.id) return console.error('the shape should have an id');
    const dimensions = await shape.dimensions;
    let widthDimension;
    for (const dimension of dimensions) {
      const kind = await dimension.kind;
      if (kind?.uri === DIMENSIONS.width) {
        widthDimension = dimension;
      }
    }
    if (!widthDimension) {
      return console.error('the shape should have the required dimensions');
    }
    const width = await dimensionToShapeDimension(widthDimension, 'width');
    return new this(shape, width);
  }

  async convertToNewUnit(unit: Unit, store: Store) {
    this.width.unit = unit;
    this.width.dimension.set('unit', unit);
    await store.request(saveRecord(this.width.dimension));
  }

  async validateAndsave(store: Store) {
    const widthValid = await this.width.dimension.validate();
    const shapeValid = await this.shape.validate();
    if (widthValid && shapeValid) {
      await store.request(saveRecord(this.width.dimension));
      await store.request(saveRecord(this.shape));
      return true;
    }
    return false;
  }

  async reset() {
    this.width.dimension.reset();
    this.width = await dimensionToShapeDimension(this.width.dimension, 'width');
    this.shape.reset();
  }
  async remove(store: Store) {
    this.width.dimension.deleteRecord();
    await store.request(saveRecord(this.width.dimension));
    this.shape.deleteRecord();
    await store.request(saveRecord(this.shape));
  }
}
