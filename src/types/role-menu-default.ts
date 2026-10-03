/**
 * What a built-in role can open before anyone edits its menu in the Role screen.
 *
 * The server decides this and sends it on the signed-in profile
 * (`permissions.menu[role].default`); each app turns the tier into its own
 * screens — a screen declares its tier where it is declared (web sidebar,
 * Business Made sidebar, `MOBILE_APP_MENU`).
 *
 * `all` is every screen; `none` is the shopper/guest shape (no menus). Tiers
 * widen: `maker` includes everything `everyone` can see, and so on.
 */
export type MenuAccessTier = 'everyone' | 'maker' | 'manager' | 'admin';
export type RoleMenuDefault = MenuAccessTier | 'all' | 'none';

export const ROLE_MENU_DEFAULTS: Record<string, RoleMenuDefault> = {
  Guest: 'none',
  Customer: 'none',
  User: 'everyone',
  Publisher: 'maker',
  Reviewer: 'maker',
  PowerUser: 'manager',
  RootPowerUser: 'manager',
  ContentAdmin: 'manager',
  ConfigAdmin: 'admin',
  Owner: 'all',
  System: 'all',
  RootAdmin: 'all',
  RootSystem: 'all',
  RootUser: 'all',
};

/** The default menu tier for a built-in role name, or null when it has none. */
export const roleMenuDefault = (roleName: string): RoleMenuDefault | null =>
  Object.prototype.hasOwnProperty.call(ROLE_MENU_DEFAULTS, roleName) ? ROLE_MENU_DEFAULTS[roleName] : null;
