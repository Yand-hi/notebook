```ts
type User = {
    id: string | number;
    name: string;
    age: number
}
//  Partial 使得 User 中的属性都枚举变为可选属性
//  Omit 使得 User 中所有可选属性排除了其中的 id
type T = Omit<Partial<User>, 'id'>
type CreateResource = (path: string) => {
    create: (attrs: T) => Promise<Response<User>>;
    delete: (id: User['id']) => Promise<Response<never>>;
    update: (id: User['id'], attrs: T) => Promise<Response<User>>;
    get: (id: User['id']) => Promise<Response<User>>;
    getPages: (page: number) => Promise<Response<User[]>>;
}

const createResource: CreateResource = (path) => {
    return {
        create() { },
        delete() { },
        update() { },
        get() { },
        getPages() { }
    }
}

const useResource = createResource('/api/vi/user')
```