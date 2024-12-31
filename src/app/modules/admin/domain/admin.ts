import { Branch } from './../../branch/domain/branch/branch';
import { Organization } from './../../organization/domain/organization';
import { AdminStatus } from './adminStatus';
import { Role } from './role';

interface AdminInput {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: AdminStatus;
  organization_id: string;
  password?: string;
  organization?: Organization;
  branches?: Branch[];
  roles?: Role[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export class Admin {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly contact: string;
  public readonly is_verified: boolean;
  public readonly status: AdminStatus;
  public readonly organization_id: string;
  public readonly password: string;
  public readonly organization?: Organization;
  public readonly branches?: Branch[];
  public readonly roles?: string[];
  public readonly created_at: Date;
  public readonly updated_at: Date;
  public readonly deleted_at?: Date;

  constructor({
    contact,
    created_at,
    email,
    id,
    name,
    status,
    updated_at,
    branches,
    deleted_at,
    organization,
    password,
    roles,
    organization_id,
  }: AdminInput) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.contact = contact;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;

    if (!organization) this.organization_id = organization_id;
    if (deleted_at) this.deleted_at = deleted_at;
    if (password) this.password = password;

    if (organization) this.organization = organization;
    if (branches) this.branches = branches;
    if (roles) this.roles = roles.map((role) => role.name!);
  }
}
