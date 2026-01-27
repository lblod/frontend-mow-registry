export default <T extends string>(obj: Record<T, string | null>, propName: T) =>
  (event: Event) => {
    obj[propName] = (event.target as HTMLInputElement)?.value;
  };
