export const getSiteFeatureList = () => {
  return [
    {
      value: 'blog',
      label: 'Blog',
      description: 'Enable blog function on your site',
      enable: true,
    },
    {
      enable: true,
      value: 'e-commerce',
      label: 'E-Commerce',
      description: 'Turn your site into an online store',
    },
    {
      value: 'forms',
      label: 'Forms',
      description: 'Allow users to create and host forms on your site',
      enable: false,
    },
    {
      value: 'live-chat',
      label: 'Live Chat',
      description: 'Enable live chat on your site',
      enable: false,
    },
    {
      value: 'ticket-support',
      label: 'Ticket Support',
      description: 'Enable ticket support on your site',
      enable: false,
    },
    {
      value: 'reservations',
      label: 'Reservations',
      description: 'Enable reservation system on your site',
      enable: false,
    },
    {
      value: 'documentation',
      label: 'Documentation',
      description: 'Enable documentation system on your site',
      enable: false,
    },
    {
      value: 'community',
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
  ];
};
