export const getSiteFeatureList = () => {
    return [
        {
            name: 'blog',
            label: 'Blog',
            description: 'Enable blog function on your site',
            enable: true,
            'path': '/blog',
        },
        {
            enable: true,
            name: 'e-commerce',
            label: 'E-Commerce',
            description: 'Turn your site into an online store',
            path: '/store',
        },
        {
            name: 'forms',
            label: 'Forms',
            description: 'Allow users to create and host forms on your site',
            enable: false,
            'path': '/forms',
        },
        {
            name: 'live-chat',
            label: 'Live Chat',
            description: 'Enable live chat on your site',
            enable: false,
            'path': '/support/live-chat',
        },
        {
            name: 'ticket-support',
            label: 'Ticket Support',
            description: 'Enable ticket support on your site',
            enable: false,
            'path': '/support/tickets',
        },
        {
            name: 'reservations',
            label: 'Reservations',
            description: 'Enable reservation system on your site',
            enable: false,
            'path': '/reservations',
        },
        {
            name: 'documentation',
            label: 'Documentation',
            description: 'Enable documentation system on your site',
            enable: false,
            'path': '/docs',
        },
        {
            name: 'community',
            label: 'Community',
            description: 'Mordern forum and community system',
            enable: false,
            'path': '/community',
        },

    ]
}