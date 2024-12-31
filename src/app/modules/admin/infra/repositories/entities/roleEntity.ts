import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AdminRoleSlug } from '../../../domain/adminRole';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'enum', enum: AdminRoleSlug })
  name?: AdminRoleSlug;
}
