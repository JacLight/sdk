export const getMenuList = () => ({
    "All": { value: 'all', label: 'All' },
    'General': {
        value: 'General', label: 'General',
        subMenu: [
            { value: "Site", label: "Site" },
            { value: "Publish", label: "Publish" },
            { value: "Dashboard", label: "Dashboard" },
            { value: "Inbox", label: "Inbox" },
            { value: "Workflow", label: "Workflow" },
        ]
    },
    'SitePages': {
        value: 'Site Pages', label: 'Site Pages',
        subMenu: [] as any
    },
    "AuraFlow": {
        value: "Aura Flow", label: "Aura Flow",
        subMenu: [] as any
    },
    "Storefront": {
        value: "Storefront", label: "Storefront",
        subMenu: [
            { value: "Dashboard", label: "Dashboard" },
            { value: "Product", label: "Product" },
            { value: "Order", label: "Order" },
            { value: "Invoice", label: "Invoice" },
            { value: "Shipping", label: "Shipping" },
            { value: "Return", label: "Return" },
            { value: "Promotions", label: "Promotions" },
            { value: "Discount", label: "Discount" },
            { value: "Gift Card", label: "Gift Card" },
            { value: "Inventory", label: "Inventory" },
            { value: "Finances", label: "Finances" },
            { value: "Attribute", label: "Attribute" },
        ]
    },
    "CRM": {
        value: "CRM", label: "CRM",
        subMenu: [
            { value: "Dashboard", label: "Dashboard" },
            { value: "360", label: "360" },
            { value: "Tickets", label: "Tickets" },
            { value: "Events & Reservations", label: "Events & Reservations" },
            { value: "Chat", label: "Chat" },
            { value: "Forms", label: "Forms" },
            { value: "Call", label: "Call" },
            { value: "Customers", label: "Customers" },
            { value: "Send", label: "Send" },
            { value: "Notification", label: "Notification" },
        ]
    },
    'Content': {
        value: 'Content', label: 'Content',
        subMenu: [
            { value: 'Post', label: 'Post' },
            { value: 'Document', label: 'Document' },
            { value: 'Navigation', label: 'Navigation' },
            { value: 'Tag', label: 'Tag' },
            { value: 'Category', label: 'Category' },
            { value: 'View Template', label: 'View Template' },
            { value: 'View Component', label: 'View Component' },
        ]
    },
    "Database": {
        value: "Database", label: "Database",
        subMenu: [
            { value: "Base Collection", label: "Base Collection" },
            { value: "Custom Collection", label: "Custom Collection" },
            { value: "Sub Schemas", label: "Sub Schemas" },
            { value: "Import, Export Data", label: "Import, Export Data" },
        ]
    },
    "Application": {
        value: "Application", label: "Application",
        subMenu: [
            { value: "Mintflow Designer", label: "Mintflow Designer" },
            { value: "TemplateEditor", label: "TemplateEditor" },
            { value: "CreativeStudio", label: "CreativeStudio" },
        ]
    },
    'Configuration': {
        value: "Configuration", label: "Configuration",
        subMenu: [
            { value: "Business Locations", label: "Business Locations" },
            { value: "Settings", label: "Settings" },
            { value: "User, Group", label: "User, Group" },
            { value: "Role & Permission", label: "Role & Permission" },
            { value: "Password Policy", label: "Password Policy" },
            { value: "Integration Config", label: "Integration Config" },
            { value: "Escalation", label: "Escalation" },
            { value: "Translation", label: "Translation" },
            { value: "Blacklist", label: "Blacklist" },
        ]
    },
    'trash': {
        value: "Trash", label: "Trash",
        subMenu: [] as any
    }
})