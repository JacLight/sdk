export const getSiteFeatureList = () => {
  return [
    {
      value: 'blog',
      takesPage: true,
      label: 'Blog',
      description: 'Enable blog function on your site',
      enable: true,
    },
    {
      value: 'storefront',
      takesPage: true,
      label: 'Storefront',
      description: 'Catalog, product pages and checkout, on a page you name',
      enable: true,
    },
    {
      value: 'payment',
      takesPage: true,
      label: 'Payment',
      description: 'A page where a customer settles what is owed on an order',
      enable: true,
    },
    {
      value: 'ticket',
      takesPage: true,
      label: 'Support Tickets',
      description: 'Raise a ticket and look one up, on a page you name',
      enable: true,
    },
    {
      value: 'service-menu',
      takesPage: true,
      label: 'Service Menu',
      description: 'Order from a service or food menu, on a page you name',
      enable: true,
    },
    {
      value: 'tables',
      takesPage: true,
      label: 'Tables',
      description: 'List a collection, one path per table',
      enable: true,
    },
    {
      value: 'forms',
      takesPage: true,
      label: 'Forms',
      description: 'Allow users to create and host forms on your site',
      enable: false,
    },
    {
      value: 'affiliate-marketing',
      takesPage: true,
      label: 'Affiliate Marketing',
      description: 'Enable affiliate marketing on your site',
      enable: false,
    },
    {
      value: 'live-chat',
      label: 'Live Chat',
      description: 'Enable live chat on your site',
      enable: false,
    },
    {
      value: 'reservations',
      takesPage: true,
      label: 'Reservations',
      description: 'Enable reservation system on your site',
      enable: false,
    },
    {
      value: 'community',
      takesPage: true,
      label: 'Community',
      description: 'Mordern forum and community system',
      enable: false,
    },
    {
      value: 'audio-player',
      label: 'Audio Player',
      description: 'Enable audio player on your site',
      enable: false,
    },
    {
      value: 'unsubscribe',
      takesPage: true,
      label: 'Unsubscribe',
      description: 'Enable unsubscribe functionality on your site',
      enable: false,
    }
  ];
};
