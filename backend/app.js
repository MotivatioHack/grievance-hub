import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path'; // Import the 'path' module
import { fileURLToPath } from 'url'; // Import for ES modules
import { errorHandler } from './utils/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import adminRoutes from './routes/admin.routes.js';
import escalationRoutes from './routes/escalation.routes.js';

dotenv.config();

// --- Get directory name for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- End directory name setup ---

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173'], // Allow both development ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow credentials
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resource sharing
})); 
app.use(morgan('dev'));
// Body parsers are added within specific routes now

// --- Serve static files from the 'uploads' directory ---
// This makes files accessible via URLs like http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// --- End static file serving ---

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/escalations', escalationRoutes);

app.use(errorHandler);

export default app;