
export const rolePermissions = {
  super_admin: [
    "dashboard",
    "reports",
    "module_access_permission",
    "users"
  ],

  admin: [
    "dashboard",
    "reports",
    "users"
  ],

  agent: [
    "dashboard",
    "reports"
  ]
};

export const hasPermission = (role, module) => {
  return rolePermissions[role]?.includes(module) ?? false;
};
