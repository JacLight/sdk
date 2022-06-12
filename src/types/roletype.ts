import { BaseModel, PermissionModel, UserRoleModel } from '../models';
import { toTitleCase } from '../utils';
import {
  PermissionTypeComponent,
  PermissionTypeContent,
} from './permissiontype';

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
  RootUser = 'RootUser',
  RootPowerUser = 'RootPowerUser',
}

export const getPermission = () => {
  return {
    Guest: {
      content: [PermissionTypeContent.read],
      component: [PermissionTypeComponent.view],
    },

    User: {
      content: [PermissionTypeContent.read, PermissionTypeContent.create],
      component: [PermissionTypeComponent.view],
    },

    RootUser: {
      content: [PermissionTypeContent.read, PermissionTypeContent.create],
      component: [PermissionTypeComponent.view],
    },


    Owner: {
      content: Object.values(PermissionTypeContent),
      component: Object.values(PermissionTypeComponent),
    },

    Publisher: {
      content: [
        PermissionTypeContent.read,
        PermissionTypeContent.create,
        PermissionTypeContent.update,
        PermissionTypeContent.review,
        PermissionTypeContent.delete,
      ],
    },

    Reviewer: {
      content: [
        PermissionTypeContent.read,
        PermissionTypeContent.review,
        PermissionTypeContent.approve,
      ],
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
    },

    ContentAdmin: {
      content: Object.values(PermissionTypeContent),
      component: [
        PermissionTypeComponent.view,
        PermissionTypeComponent.configure,
      ],
    },

    ConfigAdmin: {
      component: Object.values(PermissionTypeComponent),
    },

    RootAdmin: {
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
    const rolePermissions: any = getPermission()[role]
    const compoentPermissions: [] = rolePermissions.component
    const contentPermissions: [] = rolePermissions.content
    const newRole: UserRoleModel = {
      sk: role,
      data: {
        name: role,
        description: role,
        type: 'system',
        permissions: {
          component: compoentPermissions?.join(","),
          content: contentPermissions?.join(",")
        }
      }
    }
    roles.push(newRole)
  })
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
    )
  }
  return baseRole;
};

export const getPermissionEffective = (roleNames: RoleItemType[]) => {
  let contentPermissions: string[] = [];
  let componentPermissions: string[] = [];

  roleNames.forEach(role => {
    const rolePermissions = getPermissionRoleEffective(role);
    contentPermissions = Array.from(new Set([...contentPermissions, ...rolePermissions.content]))
    componentPermissions = Array.from(new Set([...componentPermissions, ...rolePermissions.component]))
  })

  return { content: contentPermissions, component: componentPermissions };
};

export const getPermissionComponent = () => {
  const permission: PermissionModel = [];
  Object.values(RoleType).forEach((role: any) => {
    if (role === 'RootAdmin' || role === 'ContentAdmin' || role === 'System') return;
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
    if (role === 'RootAdmin' || role === 'ConfigAdmin' || role === 'System') return;
    permission.push({
      role: role,
      content: getPermissionRole(role).content,
      title: toTitleCase(role),
    });
  });
  return permission;
};
