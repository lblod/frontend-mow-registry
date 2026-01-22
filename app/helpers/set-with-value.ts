export default <T extends string>(
    obj: Record<T, string>,
    propName: T,
    event: Event,
  ) =>
  () => {
    obj[propName] = (event.target as HTMLInputElement)?.value;
  };
