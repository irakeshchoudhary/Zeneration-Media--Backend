import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ConnectDB } from './Config/db.js';
import subscribeRoute from './Routes/subscribeRoute.js';
import leadsRoute from './Routes/leadsRoute.js';
import callRequestRoute from './Routes/callRequestRoute.js';
import feedbackRoutes from './Routes/feedbackRoutes.js';
// Import sitemap library
import { SitemapStream, streamToPromise } from 'sitemap';

// Load env vars
dotenv.config();

const app = express();

// Production origins (Vercel frontend URLs)
const prodOrigins = [
    process.env.ORIGIN_1, // e.g. https://zenerationmedia.vercel.app
    process.env.ORIGIN_2,  // koi dusra allowed origin ho toh
    'http://localhost:5173' // TEMPORARY: Added for local frontend testing against Render backend
];

// Development origin
const devOrigin = ['http://localhost:5173'];

// Allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigin;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            console.log('CORS allowed:', origin);
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Connect to MongoDB
ConnectDB();

// Routes
app.use('/', subscribeRoute);
app.use('/', leadsRoute);
app.use('/call-request', callRequestRoute);
app.use('/api/feedback', feedbackRoutes);
app.get('/', (req, res) => {
    res.send('API is running');
});
// Sitemap route
app.get('/sitemap.xml', async (req, res) => {
    try {
        const smStream = new SitemapStream({ hostname: 'https://zenerationmedia.com' });

        const urls = [
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/services', changefreq: 'weekly', priority: 0.8 },
            { url: '/clients', changefreq: 'weekly', priority: 0.8 },
            { url: '/why-zenmedia', changefreq: 'weekly', priority: 0.8 },
            { url: '/faqs', changefreq: 'weekly', priority: 0.8 },
            { url: '/about', changefreq: 'weekly', priority: 0.8 },
            { url: '/contact', changefreq: 'weekly', priority: 0.9 },
        ];

        // Add URLs to the sitemap
        urls.forEach(url => smStream.write(url));

        smStream.end();

        // Generate and send the sitemap
        const sitemap = await streamToPromise(smStream);
        res.header('Content-Type', 'application/xml');
        res.send(sitemap.toString());
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).end(); // Send a 500 error if something goes wrong
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 