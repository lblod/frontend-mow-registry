export default <T extends string, U>(
    obj: Record<T, U>,
    propName: T,
    value: U,
  ) =>
  () => {
    obj[propName] = value;
  };
