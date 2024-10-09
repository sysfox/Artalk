export type Constructor<T, D extends readonly (keyof InjectDeps)[] = any> = (
  ...args: { [K in keyof D]: D[K] extends keyof InjectDeps ? InjectDeps[D[K]] : never }
) => T

export interface Provider<T> {
  /** Implementation constructor */
  impl: Constructor<T>

  /** Dependency constructors */
  deps: readonly (keyof InjectDeps)[]
}

export interface InjectionContainerMethods {
  provide<
    K extends keyof InjectDeps,
    T extends InjectDeps[K] = any,
    D extends readonly (keyof InjectDeps)[] = [],
  >(
    key: K,
    impl: Constructor<T, D>,
    deps?: D,
  ): void

  inject<T = undefined, K extends keyof InjectDeps = any>(
    key: K,
  ): T extends undefined ? InjectDeps[K] : T
}

export function createInjectionContainer(): InjectionContainerMethods {
  const providers = new Map<any, Provider<any>>()

  const provide: InjectionContainerMethods['provide'] = (key, impl, deps) => {
    providers.set(key, { impl, deps: deps || [] })
  }

  const inject: InjectionContainerMethods['inject'] = (key) => {
    const provider = providers.get(key)
    if (!provider) {
      throw new Error(`No provide for ${key}`)
    }

    const { impl, deps } = provider
    const params = deps.map((d) => inject(d))

    return impl(...params)
  }

  return { provide, inject }
}
