export function createInjectableProvider<T>(
  usecase: string,
  useClass: new (...args: any[]) => T,
  dependencies: string[],
) {
  return {
    provide: usecase,
    useFactory: (...args: any[]) => {
      return new useClass(...args);
    },
    inject: dependencies,
  };
}
