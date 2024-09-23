export const PERMISSIONS = {
  getUsers: 'getUsers',
  manageUsers: 'manageUsers',
};

const allRoles = {
  user: [],
  admin: [PERMISSIONS.getUsers, PERMISSIONS.manageUsers],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
