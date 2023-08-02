export function createInjectableProvider<T>(
  usecase: new (...args: any[]) => T,
  dependencies: string[],
) {
  return {
    provide: usecase,
    useFactory: (...args: any[]) => {
      return new usecase(...args);
    },
    inject: dependencies,
  };
}
