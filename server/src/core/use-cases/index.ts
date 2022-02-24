export interface UseCase<Params, Return> {
  execute(params: Params): Promise<Return>;
}
