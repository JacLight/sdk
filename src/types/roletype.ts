import { UserModel } from "@models/user";
import { PermissionTypeComponent, PermissionTypeContent } from "./permissiontype"

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
}

export const defaultRolePermission = {

    Guest: {
        content: [PermissionTypeContent.read],
        component: [PermissionTypeComponent.view]
    },

    User: {
        content: [PermissionTypeContent.read, PermissionTypeContent.create],
        component: [PermissionTypeComponent.view]
    },

    Owner: {
        content: Object.values(PermissionTypeContent),
        component: Object.values(PermissionTypeComponent),
    },

    Publisher: {
        content: [PermissionTypeContent.read, PermissionTypeContent.create, PermissionTypeContent.update, PermissionTypeContent.review, PermissionTypeContent.delete],
    },

    Reviewer: {
        content: [PermissionTypeContent.read, PermissionTypeContent.review, PermissionTypeContent.approve],
    },

    PowerUser: {
        content: [PermissionTypeContent.read, PermissionTypeContent.create, PermissionTypeContent.update, PermissionTypeContent.review, PermissionTypeContent.delete],
        component: [PermissionTypeComponent.view, PermissionTypeComponent.configure]
    },

    ContentAdmin: {
        content: Object.values(PermissionTypeContent),
        component: [PermissionTypeComponent.view, PermissionTypeComponent.configure]
    },

    ConfigAdmin: {
        component: Object.values(PermissionTypeContent),
    }
}

type xt = keyof typeof RoleType;
type xtt = Exclude<xt, "RootAdmin" | 'System'>;

export const getRolePermission = (roleName: xtt) => {
    if (roleName === RoleType.Guest || roleName === RoleType.User) {
        return defaultRolePermission[roleName];
    }

    const baseRole = defaultRolePermission.User;
    const addRole: any = defaultRolePermission[roleName];
    if (addRole.content) baseRole.content = { ...baseRole.content, ...addRole.content }
    if (addRole.component) baseRole.component = { ...baseRole.component, ...addRole.component }

    return baseRole;
}

export const hasPermission = (actor: UserModel, resource: string) => {
    console.log(actor)
    console.log(resource)
}