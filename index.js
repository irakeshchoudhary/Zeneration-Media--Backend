import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ConnectDB } from './Config/db.js';
import subscribeRoute from './Routes/subscribeRoute.js';
import leadsRoute from './Routes/leadsRoute.js';
import callRequestRoute from './Routes/callRequestRoute.js';
// Import sitemap library
import { SitemapStream, streamToPromise } from 'sitemap';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
ConnectDB();

// Routes
app.use('/api', subscribeRoute);
app.use('/api', leadsRoute);
app.use('/api/call-request', callRequestRoute);

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