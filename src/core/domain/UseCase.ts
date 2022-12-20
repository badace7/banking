export interface IUseCase<T, U> {
  execute(data?: T): Promise<T | U>;
}
