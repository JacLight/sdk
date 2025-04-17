export const getSiteFeatureList = () => {
    return [
        {
            value: 'e-commerce',
            label: 'E-Commerce',
            description: 'Turn your site into an online store',
        },
        {
            value: 'blog',
            label: 'Blog',
            description: 'Enable blog function on your site',
        },
        {
            value: 'forms',
            label: 'Forms',
            description: 'Allow users to create and host forms on your site',
        },
        {
            value: 'live-chat',
            label: 'Live Chat',
            description: 'Enable live chat on your site',
        },
        {
            value: 'community',
            label: 'Community',
            description: 'Mordern forum and community system',
            pages: ['forum', 'forum-detail', 'forum-replies', 'forum-create', 'forum-edit', 'forum-categories']
        },
        {
            value: 'ticket-support',
            label: 'Ticket Support',
            description: 'Enable ticket support on your site',
            pages: ['new ticket', 'ticket-detail', 'ticket-replies', 'tickets']
        },
        {
            value: 'reservations',
            label: 'Reservations',
            description: 'Enable reservation system on your site',
            pages: ['service-menu', 'service-calender', 'service-menu-item-detail', 'service-menu-item-booking', 'service-menu-booking-confirmation', 'service-menu-booking-cancellation', 'service-menu-booking-reschedule',]
        },
    ]
}