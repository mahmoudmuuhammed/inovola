import { OrganizationEntity } from './../../../../organization/infra/repositories/entity/organizationEntity';
import { PosBranchEntity } from './../../../../branch/infra/repositories/posBranch/entity/posBranchEntity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './roleEntity';
import { AdminStatus } from '../../../domain/adminStatus';

@Entity({ name: 'admins' })
export class AdminEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  contact: string;

  @Column()
  is_verified: boolean;

  @Column({ type: 'text', nullable: true })
  email: string | null;

  @Column({ select: false })
  password: string;

  @Column({ type: 'uuid' })
  organization_id: string;

  @Column({ type: 'enum', enum: AdminStatus, default: AdminStatus.ACTIVE })
  status?: AdminStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date;

  // Relations
  @ManyToMany(() => PosBranchEntity, (branch) => branch.admins)
  @JoinTable({
    name: 'admin_branches',
    joinColumn: { name: 'admin_id' },
    inverseJoinColumn: { name: 'branch_id' },
  })
  branches?: PosBranchEntity[];

  @ManyToOne(() => OrganizationEntity, (organization) => organization.admins)
  @JoinColumn({ name: 'organization_id' })
  organization?: OrganizationEntity;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'admins_roles',
    joinColumn: { name: 'admin_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];
}
