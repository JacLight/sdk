export const siteCategories = [
    'Home Inspection',
    'Tree Service',
    'Event Planning',
    'Drywall',
    'Carpentry',
    'Private Investigating',
    'Esthetician',
    'Chiropractor',
    'Chimney Sweep',
    'Garage Door Services',
    'Computer Repair',
    'Artificial Intelligence',
    'Interior Design',
    'Dentist',
    'General Contracting',
    'Pressure Washing',
    'Software',
    'Life Coaching',
    'Shop',
    'Glass Repair and Installation',
    'Demolition Contractor',
    'Content Writing',
    'Consulting',
    'Window Cleaning',
    'Concrete',
    'Towing',
    'Tutoring',
    'Insurance Broker',
    'Beauty',
    'Chef',
    'Blogger',
    'Boat Detailing',
    'Digital Development and Design',
    'Design',
    'Video Production',
    'Hair Salon',
    'Excavation',
    'Recruiting',
    'Security',
    'Handyman',
    'Electrician',
    'Dog Training',
    'Personal Training',
    'Contractor',
    'Tour Guide',
    'Cafe',
    'Online Learning',
    'Paving',
    'Car Detailing',
    'Project Management',
    'Acupuncture',
    'Physiotherapy',
    'IT Consulting',
    'Electrical Contracting',
    'Midwife',
    'Garage Door',
    'Financial Management and Consulting',
    'Property Management',
    'Dog Walking',
    'Public Relations',
    'Soft Washing',
    'Personal Organization',
    'Jewelry',
    'Bookkeeping',
    'Education',
    'Architecture',
    'Makeup Artist',
    'Pet Sitting',
    'DJ',
    'Marketing Agency',
    'School',
    'Content Creator',
    'UI/UX Design',
    'Law Firm',
    'Landscaping',
    'House cleaning',
    'Locksmith',
    'Fence Services',
    'Audio Production',
    'Music Instruction',
    'Food Delivery',
    'Business Consulting',
    'Locksmith Services',
    'Gaming',
    'Career Coaching',
    'Pool & Spa Services',
    'Editing',
    'Massage Therapy',
    'Roofing',
    'Affiliate Marketing',
    'Social Media Agency',
    'Online Store',
    'Accommodation',
    'Digital Marketing',
    'Photography',
    'Cleaning',
    'Bike Mechanic',
    'Gardening',
    'Yoga Instruction',
    'Taxi',
    'Art Restoration',
    'Women\'s Fashion',
    'Restoration',
    'Video Gaming',
    'Snow Removal',
    'Virtual Assistant',
    'News',
    'Construction',
    'Fitness',
    'Coaching',
    'Installation Services',
    'Property Maintenance',
    'Accounting',
    'Auto Detailing',
    'Graphic Design',
    'Travel Agency',
    'Social Media Marketing',
    'Mechanical Contracting',
    'Restaurant',
    'Men\'s Fashion',
    'Real estate',
    'Real Estate Development',
    'Pizza Restaurant',
    'Catering',
    'Elevator Services',
    'Food',
    'Copywriting',
    'Furniture Restoration',
    'Retail Store',
    'Landscape Design',
    'Video Editing',
    'Psychic',
    'Real Estate Investment',
    'Plumber',
    'Carpet Cleaning',
    'Mechanic',
    'Audio Editing',
    'Coffee Shop',
    'Barber Shop',
    'Financial Planning',
    'Remodeling',
    'Mortgage Broker',
    'Well Water Services',
    'Janitorial Services',
    'Church',
    'Resume Writing',
    'Sports Instruction',
    'Solar Repair and Installation',
    'Influencer Marketing',
    'Illustrating',
    'Mobile Repair',
    'Bar',
    'Software Development',
    'Marketing',
    'Tree Care',
    'Tourism',
    'Counselling',
    'Bakery',
    'Online Entertainment',
    'Grant Writing',
    'Nail Salon',
    'Non - profit',
    'Translation',
    'Junk Removal',
    'Technology',
    'Flooring',
    'Power Washing',
    'Real Estate Agent',
    'Information Technology',
    'Appliance Repair',
    'Lactation Consulting',
    'HVAC',
    'Irrigation Services',
    'Real Estate and Construction Consulting',
    'Hair Stylist',
    'Web Design',
    'Piano Repair',
    'Tiling',
    'Trucking',
    'Art',
    'Pest Control',
    'Pool Cleaning',
    'Fashion',
    'Web Development',
    'Production and Construction Management',
    'House Painting',
    'Writing',
    'Doctor',
    'Window Washing',
    'Videography',
    'Psychology',
    'Social Media Management',
    'Arborist',
    'Hotel',
    'Plumbing',
    'Marketing Consulting',
    'Clothing',
    'Wellness Consultant',
    'Lawn Care',
    'Music',
]
export const designEmotions = ['happy', 'warm', 'welcoming', 'neutral', 'Professional', 'trustworthy', 'Exciting', 'energetic', 'Calm', 'peaceful']
export const designStyles = ['modern', 'classic', 'retro', 'vintage', 'futuristic', 'minimalist', 'grunge', 'art/deco', 'bohemian', 'shabby/chic', 'industrial', 'mid-century', 'scandinavian', 'contemporary']
export const siteSectionTypes = [
    {
        name: "home",
        use: "hero",
        incompatible_with: []
    },
    {
        name: "header",
        use: "navigation",
        incompatible_with: ["header-with-logo", "header-with-navigation-and-logo"]
    },
    {
        name: "header-with-logo",
        use: "navigation",
        incompatible_with: ["header", "header-with-navigation-and-logo"]
    },
    {
        name: "header-with-navigation-and-logo",
        use: "navigation",
        incompatible_with: ["header", "header-with-logo"]
    },
    {
        name: "navigation",
        use: "navigation",
        incompatible_with: ["header-with-navigation-and-logo"]
    },
    {
        name: "hero-section",
        use: "hero",
        incompatible_with: []
    },
    {
        name: "about-us",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "services-overview",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "product-showcase",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "testimonials",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "portfolio-display",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "case-studies",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "blog-section",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "news-updates",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "contact-form",
        use: "feedback",
        incompatible_with: ["contact-form-with-map"]
    },
    {
        name: "contact-form-with-map",
        use: "feedback",
        incompatible_with: ["contact-form"]
    },
    {
        name: "call-to-action",
        use: "engagement",
        incompatible_with: []
    },
    {
        name: "faqs",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "footer",
        use: "footer",
        incompatible_with: [
            "footer-with-navigation",
            "footer-with-logo",
            "footer-with-logo-and-navigation",
            "footer-with-contact-information"
        ]
    },
    {
        name: "footer-with-navigation",
        use: "footer",
        incompatible_with: ["footer", "footer-with-logo", "footer-with-logo-and-navigation", "footer-with-contact-information"]
    },
    {
        name: "footer-with-logo",
        use: "footer",
        incompatible_with: ["footer", "footer-with-navigation", "footer-with-logo-and-navigation", "footer-with-contact-information"]
    },
    {
        name: "footer-with-logo-and-navigation",
        use: "footer",
        incompatible_with: ["footer", "footer-with-navigation", "footer-with-logo", "footer-with-contact-information"]
    },
    {
        name: "footer-with-contact-information",
        use: "footer",
        incompatible_with: ["footer", "footer-with-navigation", "footer-with-logo", "footer-with-logo-and-navigation"]
    },
    {
        name: "subscription-form",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "team-members",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "gallery",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "event-calendar",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "newsletter-signup",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "social-proof",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "client-logos",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "media-mentions",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "features-highlight",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "benefits-explanation",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "pricing-table",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "legal-information",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "press-media-coverage",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "map",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "review-summary",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "promotional-banner",
        use: "engagement",
        incompatible_with: []
    },
    {
        name: "feature-comparison-chart",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "video-introduction",
        use: "hero",
        incompatible_with: []
    },
    {
        name: "interactive-elements",
        use: "engagement",
        incompatible_with: []
    },
    {
        name: "product-service-features",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "contact-information",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "search-bar",
        use: "navigation",
        incompatible_with: []
    },
    {
        name: "login-register",
        use: "engagement",
        incompatible_with: []
    },
    {
        name: "resource-downloads",
        use: "engagement",
        incompatible_with: []
    },
    {
        name: "customer-support",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "awards-certifications",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "user-testimonials",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "product-demos",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "blog-categories",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "case-study-summaries",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "related-articles",
        use: "informational",
        incompatible_with: []
    },
    {
        name: "project-thumbnails",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "service-descriptions",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "product-descriptions",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "photo-slider",
        use: "portfolio",
        incompatible_with: []
    },
    {
        name: "lead-capture-form",
        use: "feedback",
        incompatible_with: []
    },
    {
        name: "limited-time-offers",
        use: "engagement",
        incompatible_with: []
    }
];


//Site Category and Recommended Sections/required sections -- ai can pick others
//use can request to add or remove sections

// const pageJson = {
//     "name": "Upwind Site",
//     "template": "Upwind site template",
//     "description": "A modern and clean site template",
//     "type": "page",
//     "categories": ["business", "modern"],
//     "tags": ["responsive", "clean"],
//     classification: {
//     },
//     sections: ['section-1'],
//     layout: '<div class="upwind-site">...</div>',
// }

// const sectionJson = {
//     "id": "section-1",
//     "template": "Upwind site template",
//     "description": "A modern and clean site template",
//     "type": "section",
//     classification: {

//     },
//     "categories": ["business", "modern"],
//     "tags": ["responsive", "clean"],
//     "html": "<div class='upwind-site'>...</div>",
// }