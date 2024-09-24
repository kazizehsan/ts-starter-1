export enum PERMISSIONS {
  getUsers = 'getUsers',
  manageUsers = 'manageUsers',
}

export enum ROLES {
  user = 'user',
  admin = 'admin',
}

const RolesToPermissions = {
  [ROLES.user]: [],
  [ROLES.admin]: [PERMISSIONS.getUsers, PERMISSIONS.manageUsers],
};

export const roleRights: Map<string, string[]> = new Map(Object.entries(RolesToPermissions));
