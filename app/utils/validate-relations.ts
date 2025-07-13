import type { AsyncHasMany } from '@warp-drive/legacy/model';
import type TribontShape from 'mow-registry/models/tribont-shape';
import type Variable from 'mow-registry/models/variable';

export async function validateVariables(
  variablesProm: Variable[] | PromiseLike<Variable[]> | AsyncHasMany<Variable>,
) {
  const variables = await variablesProm;
  return !(
    await Promise.all(variables.map((variable) => variable.validate()))
  ).includes(false);
}

export async function validateShapes(
  shapesProm:
    | TribontShape[]
    | PromiseLike<TribontShape[]>
    | AsyncHasMany<TribontShape>,
) {
  const shapes = await shapesProm;
  return !(
    await Promise.all(
      shapes.map(async (shape) => {
        const isShapeValid = await shape.validate();

        const dimensions = await shape.dimensions;
        const areDimensionsValid = !(
          await Promise.all(
            dimensions.map((dimension) => {
              return dimension.validate();
            }),
          )
        ).includes(false);

        return isShapeValid && areDimensionsValid;
      }),
    )
  ).includes(false);
}
