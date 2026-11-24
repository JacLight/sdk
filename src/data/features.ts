/**
 * The Site Features catalogue: one entry per feature a site's `data.features` rows can name.
 *   - takesPage: the feature runs on a page the owner names (the row's `page`)
 *   - builtinPage: the address the site serves it at when the row names no page
 *   - detailPage: the feature has a second page (the row's `detailPage`) — what it is called, and a hint
 *   - onWithoutRow: ON for a site with no row (only a row saying 'disable' turns it off)
 *   - widget: not a page at all — on every page, or none
 *   - icon: a lucide icon name for the feature's row
 */
export interface SiteFeatureEntry {
  value: string;
  label: string;
  description: string;
  enable: boolean;
  icon?: string;
  takesPage?: boolean;
  builtinPage?: string;
  detailPage?: { label: string; hint: string };
  onWithoutRow?: boolean;
  widget?: boolean;
}

export const getSiteFeatureList = (): SiteFeatureEntry[] => {
  return [
    {
      value: 'blog',
      icon: 'Newspaper',
      takesPage: true,
      label: 'Blog',
      description: 'Enable blog function on your site',
      enable: true,
    },
    {
      value: 'storefront',
      icon: 'ShoppingCart',
      builtinPage: 'store',
      detailPage: { label: 'Product page', hint: 'One item shows on this page, at /page/item — links, feeds and the sitemap use it.' },
      takesPage: true,
      label: 'Storefront',
      description: 'Catalog, product pages and checkout, on a page you name',
      enable: true,
    },
    {
      value: 'payment',
      icon: 'CreditCard',
      takesPage: true,
      label: 'Payment',
      description: 'A page where a customer settles what is owed on an order',
      enable: true,
    },
    {
      value: 'ticket',
      icon: 'Ticket',
      takesPage: true,
      label: 'Support Tickets',
      description: 'Raise a ticket and look one up, on a page you name',
      enable: true,
    },
    {
      value: 'service-menu',
      icon: 'UtensilsCrossed',
      takesPage: true,
      label: 'Service Menu',
      description: 'Order from a service or food menu, on a page you name',
      enable: true,
    },
    {
      value: 'tables',
      icon: 'Table',
      takesPage: true,
      label: 'Tables',
      description: 'List a collection, one path per table',
      enable: true,
    },
    {
      value: 'forms',
      icon: 'LayoutList',
      takesPage: true,
      label: 'Forms',
      description: 'Allow users to create and host forms on your site',
      enable: false,
    },
    {
      value: 'affiliate-marketing',
      icon: 'Link2',
      takesPage: true,
      label: 'Affiliate Marketing',
      description: 'Enable affiliate marketing on your site',
      enable: false,
    },
    {
      value: 'live-chat',
      icon: 'MessageSquare',
      widget: true,
      label: 'Live Chat',
      description: 'Enable live chat on your site',
      enable: false,
    },
    {
      value: 'reservations',
      icon: 'CalendarCheck',
      takesPage: true,
      label: 'Reservations',
      description: 'Enable reservation system on your site',
      enable: false,
    },
    {
      value: 'community',
      icon: 'Users',
      takesPage: true,
      label: 'Community',
      description: 'A members-only community on your site: feed, stories, groups, meetups and messages',
      enable: false,
    },
    {
      value: 'audio-player',
      icon: 'Music',
      widget: true,
      label: 'Audio Player',
      description: 'Enable audio player on your site',
      enable: false,
    },
    {
      value: 'unsubscribe',
      icon: 'BellOff',
      builtinPage: 'unsubscribe',
      takesPage: true,
      label: 'Unsubscribe',
      description: 'Enable unsubscribe functionality on your site',
      enable: false,
    },
    {
      value: 'content-player',
      icon: 'BookOpen',
      takesPage: true,
      label: 'Content Player',
      description: 'Courses, applications, trainings and multi-page documents, taken page by page on a page you name',
      enable: false,
    },
    {
      value: 'gift-card',
      icon: 'Gift',
      builtinPage: 'gift-card',
      takesPage: true,
      label: 'Gift Cards',
      description: 'Check a gift card balance, on a page you name',
      enable: false,
    },
    {
      value: 'rental',
      icon: 'Package',
      takesPage: true,
      label: 'Rentals',
      description: 'Equipment and items rented by the hour, day, week or month, on a page you name',
      enable: false,
    },
    {
      value: 'signin',
      icon: 'LogIn',
      builtinPage: 'login',
      onWithoutRow: true,
      takesPage: true,
      label: 'Sign-in',
      description: 'Customers sign in to their account, on a page you name (default /login)',
      enable: true,
    },
    {
      value: 'signup',
      icon: 'UserPlus',
      builtinPage: 'register',
      onWithoutRow: true,
      takesPage: true,
      label: 'Sign-up',
      description: 'Customers create an account, on a page you name (default /register)',
      enable: true,
    },
    {
      value: 'events',
      icon: 'CalendarDays',
      builtinPage: 'events',
      takesPage: true,
      label: 'Events',
      description: 'Your events, their tickets and ticket look-up, on a page you name',
      enable: false,
    },
  ];
};
