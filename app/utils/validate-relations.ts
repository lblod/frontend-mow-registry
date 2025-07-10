import type { PromiseManyArray } from '@ember-data/model/-private';
import type Variable from 'mow-registry/models/variable';

export async function validateVariables(
  variablesProm:
    | Variable[]
    | PromiseLike<Variable[]>
    | PromiseManyArray<Variable>,
) {
  const variables = await variablesProm;
  return !(
    await Promise.all(variables.map((variable) => variable.validate()))
  ).includes(false);
}
