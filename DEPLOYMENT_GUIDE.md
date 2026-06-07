# Deployment Guide - Vercel (Frontend) + Render (Backend)

## Quick Deployment Items

### Vercel (Frontend) - What to Add

**Configuration File:** `client/vercel.json` (already created)

**Environment Variables:**
```
VITE_API_URL=https://<your-render-backend-url>/api
```

**Project Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

### Render (Backend) - What to Add

**Configuration File:** `server/render.yaml` (already created)

**Environment Variables:**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<generate-secure-random-string>
CLIENT_URL=https://<your-vercel-frontend-url>
NODE_ENV=production
```

**Service Settings:**
- **Name:** `taskflow-backend` (or your preferred name)
- **Root Directory:** `server`
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

---

## Step-by-Step Deployment

### Step 1: Deploy Backend to Render

1. **Create MongoDB Database**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user with username and password
   - Get your connection string: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`

2. **Deploy to Render**
   - Go to [Render](https://render.com) and sign up/login
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Name:** `taskflow-backend`
     - **Root Directory:** `server`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   - Add Environment Variables:
     - `PORT`: `5000`
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate with `openssl rand -base64 32`
     - `CLIENT_URL`: `http://localhost:5173` (temporary)
     - `NODE_ENV`: `production`
   - Click **Deploy Web Service**
   - Wait for deployment (2-3 minutes)
   - Copy your Render URL (e.g., `https://taskflow-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com) and sign up/login
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Configure:
     - **Project Name:** `taskflow-frontend`
     - **Framework Preset:** `Vite`
     - **Root Directory:** `client`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Add Environment Variable:
     - `VITE_API_URL`: `https://<your-render-backend-url>/api`
   - Click **Deploy**
   - Wait for deployment (1-2 minutes)
   - Copy your Vercel domain (e.g., `https://taskflow-frontend.vercel.app`)

### Step 3: Update Backend Configuration

1. Go to your Render service dashboard
2. Navigate to **Environment** section
3. Update `CLIENT_URL` to your Vercel domain:
   - Set to: `https://taskflow-frontend.vercel.app`
4. Click **Save Changes**
5. Render will automatically redeploy

### Step 4: Verify Deployment

1. Visit your Vercel frontend URL
2. Register a new user
3. Login with the registered user
4. Create a project and verify functionality

---

## Environment Variables Reference

### Render (Backend) - Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `random-32-char-string` |
| `CLIENT_URL` | Frontend URL for CORS | `https://taskflow-frontend.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |

### Vercel (Frontend) - Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://taskflow-backend.onrender.com/api` |

---

## Important Notes

### Cookie Configuration
The backend uses HTTP-only cookies with:
- `sameSite: 'none'` (for cross-origin requests)
- `secure: true` (HTTPS only in production)

This is required when frontend and backend are on different domains.

### MongoDB Atlas IP Whitelist
- Allow Render's IP addresses or use `0.0.0.0/0` for testing
- Recommended: Add specific Render IPs for production

### Free Tier Limitations
- **Render:** 750 hours/month, sleeps after 15 minutes inactivity
- **Vercel:** Sufficient for most projects
- **MongoDB Atlas:** 512 MB storage

---

## Troubleshooting

**CORS Errors:**
- Ensure `CLIENT_URL` on Render matches Vercel domain exactly
- Check `VITE_API_URL` on Vercel points to correct Render URL

**Authentication Issues:**
- Verify JWT_SECRET is set correctly
- Check cookies in browser DevTools → Application → Cookies
- Ensure both services use HTTPS

**Database Connection:**
- Verify MongoDB Atlas IP whitelist
- Check MONGO_URI format
- Ensure database user has proper permissions

**Build Errors:**
- Check Render build logs for dependency issues
- Verify all dependencies in package.json
- Check Vercel build logs for frontend errors

---

## Cost Summary

- **Vercel:** Free tier
- **Render:** Free tier (750 hours/month)
- **MongoDB Atlas:** Free tier (512 MB storage)
