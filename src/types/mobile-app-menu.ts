/**
 * The mobile app's menu, as data.
 *
 * The Flutter app (appmint_go) declares its home grid in `kHomeAppGroups`
 * (lib/config/home_apps.dart); this mirrors those group and item ids exactly,
 * plus the bottom tabs and the More menu's sections. Each entry becomes a path
 * `/mobile/<group>/<item>` that a role can list in
 * `userrole.data.permissions.menuInclude` — the same list the web sidebars read,
 * so one role record governs every app a person uses.
 *
 * The web Role screen renders this as its "Mobile app" tab; the server resolves
 * a signed-in user's effective mobile paths from it; the app hides whatever is
 * not granted. Ids never change once published — an app in the field keys on
 * them. Add items; do not rename them. Bump MOBILE_APP_MENU_VERSION when the
 * catalog changes so the app can tell its copy is older than the server's.
 */

/** Who an item is for before anyone edits a role: tiers widen everyone → admin. */
export type MobileMenuTier = 'everyone' | 'maker' | 'manager' | 'admin';

export interface MobileMenuItem {
  id: string;
  label: string;
  path: string;
  access: MobileMenuTier;
  /**
   * The appengine route prefixes this feature uses (from the app's services).
   * The server refuses a mobile request to one of these unless the person's
   * role grants a feature that claims it — hiding a screen is not enough when
   * the API can be called directly. Matching is by whole path segment; `*`
   * matches any one segment. A route no feature claims (sign-in, profile,
   * files, generic repository reads, notifications…) is common and never gated.
   */
  api: string[];
}

export interface MobileMenuSection {
  id: string;
  title: string;
  items: MobileMenuItem[];
}

export const MOBILE_APP_MENU_VERSION = 1;
export const MOBILE_MENU_PREFIX = '/mobile';

const section = (id: string, title: string, items: [string, string, MobileMenuTier, string[]?][]): MobileMenuSection => ({
  id,
  title,
  items: items.map(([itemId, label, access, api]) => ({ id: itemId, label, access, api: api || [], path: `${MOBILE_MENU_PREFIX}/${id}/${itemId}` })),
});

// Route families, read from appmint_mobile lib/services/*.dart.
const INBOX_API = ['/crm/inbox', '/crm/communications/all', '/sync/social-activities'];
const PHONE_API = ['/phone', '/crm/communications/calls', '/crm/communications/recordings', '/crm/communications/all', '/crm/inbox/update'];
const SMS_API = ['/crm/communications/sms', '/crm/communications/all', '/crm/inbox/update'];
const CHAT_API = ['/chat'];
const PRESENCE_API = ['/chat/agents', '/chat/presence', '/chat/customers/online', '/chat/queue'];
const JOURNEY_API = ['/chat/customers'];
const PAYMENT_API = ['/storefront/stripe', '/storefront/payment-gateways'];
const POS_API = ['/storefront/pos', '/storefront/pos-categories', '/storefront/order', '/storefront/products', '/workflow/definition', ...PAYMENT_API];
const TABS_API = ['/storefront/pos/tab', '/storefront/pos/tabs', '/storefront/order', '/workflow/definition', ...PAYMENT_API];
const FLOOR_API = ['/storefront/service-point', '/storefront/pos/tab/*/assign-service-point', '/storefront/pos/tab/*/release-service-point', '/crm/reservations/service-point', '/checkin/service-point'];
const RESERVATIONS_API = ['/crm/reservations', '/checkin/from-reservation'];
const CHECKIN_API = ['/checkin', '/workflow', '/crm/reservations'];
const EVENTS_API = ['/events'];
const QUICK_LOGIN_API = ['/profile/passcode/cards', '/user/passcode/cards', '/profile/user/passcode/cards', '/profile/passcode/card/register', '/user/passcode/card/register', '/profile/user/passcode/card/register'];

export const MOBILE_APP_MENU: MobileMenuSection[] = [
  section('nav', 'Navigation', [
    ['home', 'Home', 'everyone'],
    ['inbox', 'Inbox', 'everyone', INBOX_API],
    ['calendar', 'Calendar', 'everyone'],
    ['more', 'More', 'everyone'],
  ]),
  section('comms', 'Comms & phone', [
    ['phone', 'Phone', 'everyone', PHONE_API],
    ['live_chat', 'Live Chat', 'everyone', CHAT_API],
    ['sms', 'SMS', 'everyone', SMS_API],
    ['inbox', 'Inbox', 'everyone', INBOX_API],
  ]),
  section('businessmade', 'BusinessMade', [
    ['pos', 'POS', 'maker', POS_API],
    ['tabs', 'Tabs', 'maker', TABS_API],
    ['floor', 'Floor', 'maker', FLOOR_API],
    ['reservations', 'Reservations', 'maker', RESERVATIONS_API],
    ['checkin', 'Check-in', 'maker', CHECKIN_API],
    ['take_payment', 'Take payment', 'maker', [...PAYMENT_API, '/storefront/order']],
  ]),
  section('crm', 'CRM', [
    ['pipelines', 'Pipelines', 'maker', ['/workflow']],
    ['tasks', 'Tasks', 'everyone'],
    ['contacts', 'Contacts', 'maker', JOURNEY_API],
    ['leads', 'Leads', 'maker', ['/crm/leads', ...JOURNEY_API]],
    ['support', 'Support', 'maker', ['/crm/tickets', ...JOURNEY_API]],
  ]),
  // Every event screen runs on one API family, so event features are gated
  // together: any granted event item opens /events.
  section('event', 'Event', [
    ['events', 'Events', 'maker', EVENTS_API],
    ['scan', 'Scan', 'maker', EVENTS_API],
    ['info', 'Info', 'maker', EVENTS_API],
    ['stats', 'Stats', 'manager', EVENTS_API],
    ['badge', 'Badge', 'maker', EVENTS_API],
    ['tickets', 'Tickets', 'maker', EVENTS_API],
    ['schedule', 'Schedule', 'maker', EVENTS_API],
    ['people', 'People', 'maker', EVENTS_API],
    ['manage', 'Manage', 'manager', EVENTS_API],
    ['book', 'Book', 'maker', EVENTS_API],
  ]),
  section('system', 'System', [['devices', 'Devices', 'admin']]),
  section('team', 'Workspaces & AI', [
    ['workspaces', 'Workspaces', 'everyone', ['/workspace']],
    ['ai_employees', 'AI employees', 'manager', ['/ai-employees']],
    ['approvals', 'Approvals', 'manager', ['/approval/tray', '/approval/history', '/approval/task']],
  ]),
  section('more', 'More menu', [
    ['hardware', 'Hardware', 'admin'],
    ['quick_login', 'Quick Login', 'maker', QUICK_LOGIN_API],
    ['settings', 'Settings', 'admin'],
    ['live_presence', 'Live Presence', 'everyone', PRESENCE_API],
  ]),
];

/** Same {title, items:[{path,label}]} shape as the web catalogs, for the Role screen. */
export const getMobileAppMenuCatalog = (): { id: string; title: string; items: MobileMenuItem[] }[] =>
  MOBILE_APP_MENU.map(s => ({ id: s.id, title: s.title, items: s.items.map(i => ({ ...i, api: i.api.slice() })) }));

/** Every mobile item path. */
export const getAllMobilePaths = (): string[] => MOBILE_APP_MENU.flatMap(s => s.items.map(i => i.path));

export const isMobileMenuPath = (path: unknown): boolean =>
  typeof path === 'string' && (path === MOBILE_MENU_PREFIX || path.startsWith(`${MOBILE_MENU_PREFIX}/`));

const MOBILE_TIER_ORDER: MobileMenuTier[] = ['everyone', 'maker', 'manager', 'admin'];

/** Every mobile item path at or below `tier`. */
export const mobilePathsForTier = (tier: MobileMenuTier): string[] => {
  const ceiling = MOBILE_TIER_ORDER.indexOf(tier);
  return MOBILE_APP_MENU.flatMap(s => s.items.filter(i => MOBILE_TIER_ORDER.indexOf(i.access) <= ceiling).map(i => i.path));
};

/**
 * A stored menuInclude list, reduced to the mobile item paths it grants.
 * `all` grants every item; `/mobile` or `/mobile/<group>` grants everything
 * under it (a section ticked as a whole); an item path grants itself. Paths the
 * catalog does not know (an item from a newer app) pass through unchanged.
 */
export const expandMobileMenuInclude = (list: unknown): string[] => {
  const raw: unknown[] = Array.isArray(list) ? list : typeof list === 'string' ? list.split(',') : [];
  const all = getAllMobilePaths();
  const out = new Set<string>();
  for (const entry of raw) {
    const v = String(entry || '').trim().replace(/\/+$/, '');
    if (!v) continue;
    if (v.toLowerCase().replace(/[^a-z0-9]/g, '') === 'all') { all.forEach(p => out.add(p)); continue; }
    if (!isMobileMenuPath(v)) continue;
    const under = all.filter(p => p.startsWith(`${v}/`));
    if (under.length) under.forEach(p => out.add(p));
    else out.add(v);
  }
  return Array.from(out); // not [...out]: the build transpiles Set spread loosely
};

const segments = (p: string): string[] => String(p || '').split('?')[0].split('/').filter(Boolean).map(x => x.toLowerCase());

/** Does `route` sit at or under the API prefix `prefix` (whole segments; `*` = any one)? */
export const mobileApiMatches = (prefix: string, route: string): boolean => {
  const want = segments(prefix);
  const have = segments(route);
  if (!want.length || have.length < want.length) return false;
  return want.every((seg, i) => seg === '*' || seg === have[i]);
};

/** The mobile features that claim a route. Empty = a common route, never gated. */
export const mobileFeaturesForRoute = (route: string): MobileMenuItem[] =>
  MOBILE_APP_MENU.flatMap(s => s.items.filter(i => i.api.some(prefix => mobileApiMatches(prefix, route))));
