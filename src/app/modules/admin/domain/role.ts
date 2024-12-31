import { AdminRoleSlug } from './adminRole';

interface RoleInput {
  id: number;
  name?: AdminRoleSlug;
}

export class Role {
  public readonly id: number;
  public readonly name?: AdminRoleSlug;

  constructor({ id, name }: RoleInput) {
    this.id = id;
    this.name = name!;
  }
}
