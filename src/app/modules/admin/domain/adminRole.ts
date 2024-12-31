// Admin Roles Enum
export enum AdminRoleSlug {
  OWNER = 'owner',
  MANAGER = 'manager',
  LEADER = 'leader',
  CASHIER = 'cashier',
}

// Admin Roles Enum
export const AdminRole = {
  [AdminRoleSlug.OWNER]: 1,
  [AdminRoleSlug.MANAGER]: 2,
  [AdminRoleSlug.LEADER]: 3,
  [AdminRoleSlug.CASHIER]: 4,
};
