require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Find or create dummy client
    let client = await User.findOne({ email: 'democlient@test.com' });
    if (!client) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      client = await User.create({
        name: 'Global Tech LLC',
        email: 'democlient@test.com',
        password: hashedPassword,
        role: 'Client',
      });
      console.log('Dummy client created');
    } else {
      console.log('Dummy client found');
    }

    const projects = [
      {
        title: 'MERN Stack Developer for E-commerce MVP',
        description: 'Looking for an experienced MERN stack developer to build a scalable MVP for our new e-commerce platform. You will be responsible for the full lifecycle, from database design to frontend deployment.',
        budget: 3500,
      },
      {
        title: 'Figma UI/UX Redesign for SaaS Dashboard',
        description: 'Our current SaaS analytics dashboard is clunky and outdated. We need a creative UI/UX designer to overhaul the interface in Figma, focusing on modern aesthetics and better user flows.',
        budget: 1200,
      },
      {
        title: 'Python Web Scraping Script',
        description: 'Need a reliable Python script using BeautifulSoup or Scrapy to scrape daily real estate listings from a public directory. The data should be formatted into a clean CSV file automatically.',
        budget: 450,
      },
      {
        title: 'React Native Bug Fixing & Performance Optimization',
        description: 'Our mobile app is experiencing significant lag on older Android devices and random crashes on iOS. We need an expert to dive into the React Native codebase, profile the performance, and resolve these critical bugs.',
        budget: 2000,
      },
      {
        title: 'Modern Minimalist Logo Design',
        description: 'Starting a boutique coffee roastery and need a memorable, minimalist logo. We want something that looks great on packaging and social media, utilizing a warm, earthy color palette.',
        budget: 300,
      },
      {
        title: 'Complete SEO Optimization for Local Business',
        description: 'Our plumbing business website is not ranking on Google for local searches. We need an SEO expert to perform a full audit, optimize on-page content, and build quality local backlinks.',
        budget: 800,
      },
      {
        title: 'Next.js Frontend for Headless Shopify',
        description: 'We are migrating from a standard Shopify theme to a headless commerce architecture. Need a frontend developer skilled in Next.js and Tailwind CSS to build the storefront communicating with Shopify Storefront API.',
        budget: 4000,
      },
      {
        title: 'Smart Contract Audit (Solidity)',
        description: 'We have developed a new DeFi staking contract in Solidity and need a thorough security audit before mainnet launch. You should have a proven track record of identifying vulnerabilities and writing detailed audit reports.',
        budget: 5000,
      },
      {
        title: 'Convert Figma Design to HTML/CSS',
        description: 'I have a 5-page Figma design for a corporate website that needs to be translated into pixel-perfect, responsive HTML and CSS. No JS frameworks needed, just clean, semantic code.',
        budget: 250,
      },
      {
        title: 'Setup CI/CD Pipeline on AWS',
        description: 'Looking for a DevOps engineer to set up a robust CI/CD pipeline using GitHub Actions and AWS (EC2, S3, CodeDeploy) for our Node.js application. Must ensure zero-downtime deployments.',
        budget: 1500,
      },
      {
        title: 'Write 10 SEO Blog Articles (Tech Niche)',
        description: 'Need a technical writer to produce 10 high-quality, SEO-optimized blog posts (approx 1000 words each) covering topics like AI, cloud computing, and cybersecurity. Must pass Copyscape.',
        budget: 600,
      },
      {
        title: 'Video Editor for YouTube Channel (Vlog style)',
        description: 'Looking for a skilled video editor for my weekly travel vlogs. You will need to cut raw footage, add transitions, color grade, and insert engaging motion graphics. Adobe Premiere or Final Cut preferred.',
        budget: 400,
      },
      {
        title: 'Develop Custom WordPress Plugin',
        description: 'We need a custom WordPress plugin that allows users to book appointments and syncs directly with our internal Google Calendar. It must have a clean shortcode interface for the frontend.',
        budget: 900,
      },
      {
        title: 'Data Entry from PDF to Excel',
        description: 'I have roughly 200 scanned PDF invoices. I need someone detail-oriented to manually extract the date, vendor name, and total amount into a structured Excel spreadsheet with 100% accuracy.',
        budget: 100,
      },
      {
        title: 'Develop a 2D Platformer Game in Unity',
        description: 'Seeking a Unity developer to create a short 5-level 2D platformer game. We will provide all the sprite assets and music. You handle the programming, physics, and UI integration.',
        budget: 2500,
      },
      {
        title: 'Translate 50-page Document (English to Spanish)',
        description: 'Need a native Spanish speaker to translate a 50-page employee handbook from English to Spanish. The translation must sound natural and maintain a professional corporate tone.',
        budget: 350,
      },
      {
        title: 'Fix DNS and Email Deliverability Issues',
        description: 'Our company emails keep landing in clients\' spam folders. We need an IT specialist to correctly configure our SPF, DKIM, and DMARC records on our domain registrar.',
        budget: 150,
      },
      {
        title: 'Build a Discord Community Bot (Node.js)',
        description: 'We run a large gaming community on Discord and need a custom bot built in Node.js. It needs to handle automated role assignment, trivia mini-games, and moderation logging.',
        budget: 700,
      },
      {
        title: 'Create Pitch Deck Presentation (PowerPoint)',
        description: 'We are raising our Seed round and need a visually stunning PowerPoint pitch deck. We have the content and data; you bring the design expertise to make the slides pop and impress investors.',
        budget: 500,
      },
      {
        title: 'Migration from Vue 2 to Vue 3',
        description: 'Looking for a Vue.js expert to help us migrate a mid-sized dashboard application from Vue 2 (Options API) to Vue 3 (Composition API). Must ensure all existing components function correctly post-migration.',
        budget: 2200,
      },
      {
        title: 'Design 5 Instagram Carousel Posts',
        description: 'Need a graphic designer to create 5 educational carousel posts (5-8 slides each) for our fitness brand\'s Instagram. Must match our existing brand guidelines and typography.',
        budget: 200,
      },
      {
        title: 'Develop REST API in Go (Golang)',
        description: 'We need a highly performant REST API built in Go to handle high-frequency location data updates from IoT devices. It should interface with a PostgreSQL database.',
        budget: 3000,
      },
      {
        title: '3D Product Rendering for E-commerce',
        description: 'We need photorealistic 3D renders of our new smartwatch prototype. Provide 4 different angles and one lifestyle context shot. We will supply the CAD files.',
        budget: 850,
      },
      {
        title: 'Write a Press Release for Startup Launch',
        description: 'Seeking an experienced PR writer to craft a compelling press release announcing our upcoming fintech app launch. It needs to be catchy and suitable for distribution to major tech news outlets.',
        budget: 180,
      },
      {
        title: 'Build a Custom Shopify App (Node.js/React)',
        description: 'Need a custom public Shopify app that integrates merchants\' stores with our proprietary inventory management system. Requires experience with Shopify Polaris and the Admin GraphQL API.',
        budget: 4500,
      },
      {
        title: 'Tutor for Advanced Calculus',
        description: 'Looking for a math tutor to help a university student prepare for their final Advanced Calculus exam. Need 5 one-hour remote sessions focusing on multivariable integration and vector calculus.',
        budget: 250,
      },
      {
        title: 'Fix CSS Flexbox/Grid Layout Bugs',
        description: 'Our landing page layout breaks completely on mobile devices. Need a CSS wizard to debug and fix our Flexbox and CSS Grid implementations to ensure perfect responsiveness across all screen sizes.',
        budget: 100,
      },
      {
        title: 'Set up Google Analytics 4 and Tag Manager',
        description: 'Need a digital marketing specialist to migrate our tracking from Universal Analytics to GA4 via Google Tag Manager. Must configure custom events for form submissions and button clicks.',
        budget: 400,
      },
      {
        title: 'Develop a Flutter Food Delivery App',
        description: 'Looking for a Flutter developer to build a cross-platform food delivery app. The scope includes user authentication, restaurant listing, cart management, and Stripe payment integration.',
        budget: 4800,
      },
      {
        title: 'Virtual Assistant for Email Management',
        description: 'Seeking a highly organized virtual assistant to manage the CEO\'s busy inbox. Duties include organizing folders, flagging urgent messages, and responding to routine inquiries based on templates.',
        budget: 300,
      }
    ];

    const projectsToInsert = projects.map(p => ({
      ...p,
      client: client._id,
      status: 'Open'
    }));

    await Project.insertMany(projectsToInsert);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
