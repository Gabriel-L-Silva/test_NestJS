export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract getOne(id: string): Promise<T>;

  abstract create(item: T): Promise<T>;

  abstract delete(id: string): Promise<T>;

  abstract update(id: string, item: T);
}
