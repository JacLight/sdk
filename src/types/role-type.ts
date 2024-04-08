import { BaseModel, PermissionModel, UserRoleModel } from '../models';
import { toTitleCase } from '../utils';
import { getMenuList } from './menu-list';
import {
  PermissionTypeComponent,
  PermissionTypeContent,
} from './permission-type';

export enum RoleType {
  Guest = 'Guest',
  User = 'User',
  Owner = 'Owner',
  Publisher = 'Publisher',
  Reviewer = 'Reviewer',
  PowerUser = 'PowerUser',
  System = 'System',
  ContentAdmin = 'ContentAdmin',
  ConfigAdmin = 'ConfigAdmin',
  RootAdmin = 'RootAdmin',
  RootSystem = 'RootSystem',
  RootUser = 'RootUser',
  RootPowerUser = 'RootPowerUser',
  Customer = 'Customer',
}

const menuList = getMenuList();
export const getPermission = () => {
  return {
    Guest: {
      content: [PermissionTypeContent.read],
      component: [PermissionTypeComponent.view],
      menuExclude: [menuList.All.value],
    },

    User: {
      content: [PermissionTypeContent.read, PermissionTypeContent.create],
      component: [PermissionTypeComponent.view],
      menuExclude: [menuList.All.value],
      menuInclude: [menuList.General.value, menuList.trash.value]
    },
    Customer: {
      content: [PermissionTypeContent.read, PermissionTypeContent.create],
      component: [PermissionTypeComponent.view],
      menuExclude: [menuList.All.value],
    },
    RootUser: {
      content: [PermissionTypeContent.read, PermissionTypeContent.create],
      component: [PermissionTypeComponent.view],
      menuInclude: [menuList.All.value]
    },
    Owner: {
      content: Object.values(PermissionTypeContent),
      component: Object.values(PermissionTypeComponent),
      menuInclude: [menuList.All.value]
    },
    Publisher: {
      content: [
        PermissionTypeContent.read,
        PermissionTypeContent.create,
        PermissionTypeContent.update,
        PermissionTypeContent.review,
        PermissionTypeContent.delete,
      ],
      menuInclude: [menuList.General.value, menuList.trash.value, menuList.Content.value, menuList.CRM.value, menuList.Storefront.value, menuList.AuraFlow.value, menuList.SitePages.value, menuList.Database.value],
      menuExclude: [menuList.All.value],
    },

    Reviewer: {
      content: [
        PermissionTypeContent.read,
        PermissionTypeContent.review,
        PermissionTypeContent.approve,
      ],
      menuInclude: [menuList.General.value, menuList.trash.value, menuList.Content.value, menuList.CRM.value, menuList.Storefront.value, menuList.AuraFlow.value, menuList.SitePages.value, menuList.Database.value],
      menuExclude: [menuList.All.value],
    },

    PowerUser: {
      content: [
        PermissionTypeContent.read,
        PermissionTypeContent.create,
        PermissionTypeContent.update,
        PermissionTypeContent.review,
        PermissionTypeContent.delete,
      ],
      component: [
        PermissionTypeComponent.view,
        PermissionTypeComponent.configure,
      ],
      menuInclude: [menuList.General.value, menuList.trash.value, menuList.Content.value,
      menuList.CRM.value, menuList.Storefront.value, menuList.AuraFlow.value,
      menuList.SitePages.value, menuList.Database.value],
    },
    RootPowerUser: {
      content: [
        PermissionTypeContent.read,
        PermissionTypeContent.create,
        PermissionTypeContent.update,
        PermissionTypeContent.review,
        PermissionTypeContent.delete,
      ],
      component: [
        PermissionTypeComponent.view,
        PermissionTypeComponent.configure,
      ],
      menuInclude: [menuList.General.value, menuList.trash.value, menuList.Content.value,
      menuList.CRM.value, menuList.Storefront.value, menuList.AuraFlow.value,
      menuList.SitePages.value, menuList.Database.value],
    },
    ContentAdmin: {
      content: Object.values(PermissionTypeContent),
      component: [
        PermissionTypeComponent.view,
        PermissionTypeComponent.configure,
      ],
      menuInclude: [menuList.General.value, menuList.trash.value, menuList.Content.value, menuList.CRM.value, menuList.Storefront.value, menuList.Database.value, menuList.AuraFlow.value, menuList.SitePages.value],
      menuExclude: [menuList.All.value],
    },
    ConfigAdmin: {
      component: Object.values(PermissionTypeComponent),
      menuInclude: [menuList.General.value, menuList.trash.value, menuList.Configuration.value, menuList.Database.value, menuList.CRM.value, menuList.Storefront.value],
    },
    RootAdmin: {
      component: Object.values(PermissionTypeComponent),
      content: Object.values(PermissionTypeContent),
      menuInclude: [menuList.All.value]
    },
    RootSystem: {
      component: Object.values(PermissionTypeComponent),
      content: Object.values(PermissionTypeContent),
    },
    System: {
      component: Object.values(PermissionTypeComponent),
      content: Object.values(PermissionTypeContent),
    },
  };
};

type RoleItemType = keyof typeof RoleType;
// type RoleItemTypeLess = Exclude<RoleItemType, "RootAdmin" | 'System'>;

export const getPermissionRole = (roleName: RoleItemType) => {
  const addRole: any = getPermission()[roleName];
  return addRole;
};

export const getDefaultUserRoles = (): BaseModel<UserRoleModel>[] => {
  const roles: any = [];
  Object.values(RoleType).forEach(role => {
    const rolePermissions: any = getPermission()[role];
    const newRole: UserRoleModel = {
      sk: role,
      name: role,
      data: {
        name: role,
        description: role,
        type: 'system',
        permissions: {
          component: rolePermissions.component,
          content: rolePermissions.content,
          menuInclude: rolePermissions.menuInclude,
          menuExclude: rolePermissions.menuExclude,
        },
      },
    };
    roles.push(newRole);
  });
  return roles;
};

export const getPermissionRoleEffective = (roleName: RoleItemType) => {
  if (roleName === RoleType.Guest || roleName === RoleType.User) {
    return getPermission()[roleName];
  }
  const baseRole: any = getPermission().User;
  const addRole: any = getPermission()[roleName];
  if (addRole.content) {
    baseRole.content = Array.from(
      new Set([...baseRole.content, ...addRole.content])
    );
  }
  if (addRole.component) {
    baseRole.component = Array.from(
      new Set([...baseRole.component, ...addRole.component])
    );
  }
  return baseRole;
};

//use this method to get the aggregate permissions for a user
export const getPermissionEffective = (roleNames: RoleItemType[]) => {
  let contentPermissions: string[] = [];
  let componentPermissions: string[] = [];
  if (!roleNames) {
    roleNames = Object.values(RoleType);
  }
  roleNames.forEach(role => {
    const rolePermissions = getPermissionRoleEffective(role);
    contentPermissions = Array.from(
      new Set([...contentPermissions, ...rolePermissions.content])
    );
    componentPermissions = Array.from(
      new Set([...componentPermissions, ...rolePermissions.component])
    );
  });

  return { content: contentPermissions, component: componentPermissions };
};

export const getPermissionComponent = () => {
  const permission: PermissionModel = [];
  Object.values(RoleType).forEach((role: any) => {
    if (role === 'RootAdmin' || role === 'ContentAdmin' || role === 'RootSystem' || role === 'System')
      return;
    permission.push({
      role: role,
      component: getPermissionRole(role).component,
      title: toTitleCase(role),
    });
  });
  return permission;
};

export const getPermissionContent = () => {
  const permission: PermissionModel = [];
  Object.values(RoleType).forEach((role: any) => {
    if (role === 'RootAdmin' || role === 'ConfigAdmin' || role === 'RootSystem' || role === 'System')
      return;
    permission.push({
      role: role,
      content: getPermissionRole(role).content,
      title: toTitleCase(role),
    });
  });
  return permission;
};

export const getRolesWithContentPermission = () => {
  const permissionRoles: any = {};
  Object.values(RoleType).forEach((role: any) => {
    const permission: any = getPermissionRoleEffective(role);
    permission.content.forEach((item: string) => {
      if (permissionRoles[item]) {
        permissionRoles[item].add(role);
      } else {
        permissionRoles[item] = new Set([role]);
      }
    });
  });

  Object.keys(permissionRoles).forEach(
    key => (permissionRoles[key] = Array.from(permissionRoles[key]))
  );
  return permissionRoles;
};

export const getRolesWithComponentPermission = () => {
  const permissionRoles: any = {};
  Object.values(RoleType).forEach((role: any) => {
    const permission: any = getPermissionRoleEffective(role);
    permission.component.forEach((item: string) => {
      if (permissionRoles[item]) {
        permissionRoles[item].add(role);
      } else {
        permissionRoles[item] = new Set([role]);
      }
    });
  });
  Object.keys(permissionRoles).forEach(
    key => (permissionRoles[key] = Array.from(permissionRoles[key]))
  );
  return permissionRoles;
};
