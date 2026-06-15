# Deployment Guide - Vercel (Frontend) + Render (Backend)

This guide will help you deploy TaskFlow to production using Vercel for the frontend and Render for the backend.

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (or MongoDB connection string)
- Vercel account (free tier available)
- Render account (free tier available)

## Step 1: Deploy Backend to Render

### 1.1 Create MongoDB Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Get your connection string (format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`)

### 1.2 Deploy to Render
1. Go to [Render](https://render.com) and sign up/login
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `taskflow-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string (use: `openssl rand -base64 32`)
   - `CLIENT_URL`: Leave as `http://localhost:5173` for now (will update after frontend deployment)
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**
7. Wait for deployment to complete (2-3 minutes)
8. Copy your Render service URL (e.g., `https://taskflow-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Project Name**: `taskflow-frontend` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-url>/api` (e.g., `https://taskflow-backend.onrender.com/api`)
6. Click **Deploy**
7. Wait for deployment to complete (1-2 minutes)
8. Copy your Vercel domain (e.g., `https://taskflow-frontend.vercel.app`)

## Step 3: Update Backend Configuration

1. Go back to your Render service dashboard
2. Navigate to **Environment** section
3. Update the `CLIENT_URL` environment variable:
   - Set it to your Vercel frontend domain (e.g., `https://taskflow-frontend.vercel.app`)
4. Click **Save Changes**
5. Render will automatically redeploy with the new configuration

## Step 4: Verify Deployment

1. Visit your Vercel frontend URL
2. Try to register a new user
3. Login with the registered user
4. Create a project and verify functionality

## Important Notes

### Cookie Configuration
The backend uses HTTP-only cookies for authentication with:
- `sameSite: 'none'` (for cross-origin requests)
- `secure: true` (HTTPS only in production)

This configuration is required when frontend and backend are on different domains.

### Environment Variables Summary

**Render (Backend):**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<your-secret-key>
CLIENT_URL=https://<your-vercel-domain>
NODE_ENV=production
```

**Vercel (Frontend):**
```
VITE_API_URL=https://<your-render-domain>/api
```

### Troubleshooting

**CORS Errors:**
- Ensure `CLIENT_URL` on Render matches your Vercel domain exactly
- Check that `VITE_API_URL` on Vercel points to the correct Render backend URL

**Authentication Issues:**
- Verify JWT_SECRET is set correctly on Render
- Check that cookies are being set in browser DevTools → Application → Cookies
- Ensure both services use HTTPS (required for secure cookies)

**Database Connection:**
- Verify MongoDB Atlas IP whitelist allows Render's IP addresses (use 0.0.0.0/0 for testing)
- Check that MONGO_URI format is correct
- Ensure database user has proper permissions

**Build Errors:**
- Check Render build logs for dependency installation issues
- Verify all dependencies are in package.json
- Check Vercel build logs for frontend build errors

## Cost

- **Vercel**: Free tier (sufficient for most projects)
- **Render**: Free tier (limited to 750 hours/month, sleeps after 15 minutes of inactivity)
- **MongoDB Atlas**: Free tier (512 MB storage)

## Next Steps

After successful deployment:
1. Set up custom domains (optional)
2. Configure monitoring and error tracking
3. Set up automated backups for MongoDB
4. Consider upgrading to paid tiers for better performance

## Support

For issues:
- Check Render logs: Dashboard → Logs
- Check Vercel logs: Deployments → View Build Logs
- MongoDB Atlas logs: Clusters → Metrics
