# Campus Connect

A comprehensive platform for university students to connect, collaborate, and engage with campus life.

## 🚀 Production Deployment

This application is production-ready and can be deployed to various platforms:

### Quick Deploy Options

#### 1. **Netlify (Frontend) + Render/Railway (Backend)**
- **Frontend**: Deploy to Netlify using `netlify.toml`
- **Backend**: Deploy to Render or Railway using provided configs

#### 2. **Vercel (Frontend) + Railway (Backend)**
- **Frontend**: Deploy to Vercel using `vercel.json`
- **Backend**: Deploy to Railway using `railway.json`

#### 3. **Docker Deployment**
```bash
# Build and run with Docker
docker build -t campus-connect .
docker run -p 3001:3001 campus-connect

# Or use Docker Compose
docker-compose up -d
```

#### 4. **Local Production Deployment**
```bash
# Make sure you have production environment variables set
cp .env.production .env
cp server/.env.production server/.env

# Run deployment script
./scripts/deploy.sh local
```

### 🔧 Environment Variables Setup

#### Frontend (.env.production)
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
VITE_APP_URL=https://your-production-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

#### Backend (server/.env.production)
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/campus_connect_prod
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
FRONTEND_URL=https://your-production-domain.com
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
SUPABASE_URL=your-production-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

### 📊 Production Features

- ✅ **Security**: Helmet.js, CORS, rate limiting, input validation
- ✅ **Performance**: Compression, code splitting, caching headers
- ✅ **Monitoring**: Health checks, error logging, uptime tracking
- ✅ **Scalability**: Optimized builds, database indexing, CDN-ready
- ✅ **Payments**: Production Stripe integration with webhooks
- ✅ **Authentication**: Secure Supabase auth with JWT tokens

## Features

- **Event Discovery**: Find and join campus events, workshops, and activities
- **Study Groups**: Form collaborative study groups with classmates
- **Campus Chat**: Real-time messaging with fellow students
- **Resource Sharing**: Share and discover academic materials
- **Campus Navigation**: Interactive campus maps and location services
- **Achievement System**: Gamified engagement with badges and recognition

## Quick Start

### Production Deployment

1. **Set up environment variables**:
   ```bash
   cp .env.production .env
   cp server/.env.production server/.env
   # Edit the files with your production values
   ```

2. **Deploy using the deployment script**:
   ```bash
   ./scripts/deploy.sh local
   ```

3. **Or deploy with Docker**:
   ```bash
   docker-compose up -d
   ```

### Frontend (React + Vite)

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

**Development**: `http://localhost:5173`
**Production**: `http://localhost:4173` (or your configured domain)

### Backend (Express + Node.js)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the backend server:
```bash
npm run dev
```

**Development**: `http://localhost:3001`
**Production**: `http://localhost:3001` (or your configured port)

## 🔧 Production Configuration

### Database Setup

**MongoDB Atlas (Recommended for Production)**:
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URI` in production environment variables

### Supabase Setup

1. Create a Supabase project
2. Run the migrations in `supabase/migrations/`
3. Deploy the edge functions in `supabase/functions/`
4. Update environment variables with your Supabase credentials

### Stripe Setup

1. Switch to live mode in Stripe Dashboard
2. Get your live API keys
3. Set up webhook endpoints for your production domain
4. Update environment variables with live keys

## 📈 Monitoring & Maintenance

### Health Checks
- **Backend**: `GET /health` and `GET /api/health`
- **Database**: Connection status included in health response
- **Uptime**: Process uptime tracking

### Logging
- **Production**: Combined format with timestamps
- **Development**: Detailed dev-friendly format
- **Errors**: Comprehensive error tracking and reporting

### Performance
- **Frontend**: Code splitting, lazy loading, optimized builds
- **Backend**: Compression, caching, rate limiting
- **Database**: Proper indexing and query optimization

## Current Status

**Frontend**: ✅ Production-ready with Supabase authentication
**Backend**: ✅ Production-ready with full API functionality
**Database**: ✅ MongoDB with proper indexing and security
**Payments**: ✅ Stripe integration with webhook processing
**Deployment**: ✅ Multiple deployment options available

## 🚀 Deployment Platforms

### Recommended Combinations

1. **Netlify + Railway**
   - Frontend: Netlify (automatic deployments from Git)
   - Backend: Railway (PostgreSQL + Node.js)
   - Database: Railway PostgreSQL or MongoDB Atlas

2. **Vercel + Render**
   - Frontend: Vercel (optimized for React)
   - Backend: Render (auto-scaling Node.js)
   - Database: MongoDB Atlas

3. **Docker + VPS**
   - Full-stack: Docker Compose on VPS
   - Database: MongoDB container or external service
   - Reverse proxy: Nginx

### Platform-Specific Instructions

#### Netlify Deployment
```bash
# Connect your GitHub repo to Netlify
# Build settings are in netlify.toml
# Environment variables in Netlify dashboard
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway Deployment
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

#### Render Deployment
```bash
# Connect GitHub repo to Render
# Use render.yaml for configuration
# Set environment variables in dashboard
```

## 🔒 Security Considerations

### Production Security Checklist
- ✅ Environment variables properly configured
- ✅ HTTPS enforced (handled by deployment platform)
- ✅ CORS properly configured for production domains
- ✅ Rate limiting enabled
- ✅ Input validation and sanitization
- ✅ JWT tokens with secure secrets
- ✅ Database connection with authentication
- ✅ Stripe webhooks with signature verification
- ✅ Security headers (Helmet.js)
- ✅ Error handling without information leakage

### Regular Maintenance
- Update dependencies regularly
- Monitor application logs
- Check database performance
- Review security configurations
- Update SSL certificates (if self-managed)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, JWT
- **Deployment**: Netlify (Frontend), Ready for backend deployment

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── ...
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   └── ...
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details