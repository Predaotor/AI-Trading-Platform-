# Troubleshooting Guide

## White Screen After Sign In

If you're experiencing a white screen after signing in, here are the most common causes and solutions:

### 1. Backend Server Not Running
**Problem**: The frontend components are trying to fetch data from the backend, but the server isn't running.

**Solution**: 
```bash
cd ETH-backend
python -m uvicorn app.main:app --reload --port 8000
```

**How to verify**: 
- Open browser dev tools (F12)
- Check the Console tab for network errors
- Look for errors like "Failed to fetch" or "Network Error"

### 2. Authentication Issues
**Problem**: The `useAuth()` hook is failing because the AuthProvider is not properly set up.

**Solution**: 
- Make sure `AuthProvider` wraps the `App` component in `main.tsx`
- Check that the auth context is properly initialized

### 3. Component Errors
**Problem**: One of the dashboard components is throwing an error and crashing the entire page.

**Solution**: 
- The ErrorBoundary component should catch these errors
- Check the browser console for specific error messages
- Look for missing dependencies or API failures

### 4. Missing Dependencies
**Problem**: Required libraries are not installed.

**Solution**: 
```bash
cd ETH-frontend
npm install
```

### 5. Port Conflicts
**Problem**: The backend or frontend ports are already in use.

**Solution**: 
- Check if port 8000 is available for backend
- Check if port 3000 is available for frontend
- Kill any processes using these ports

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Note any network failures

### Step 2: Check Network Tab
1. In dev tools, go to Network tab
2. Refresh the page
3. Look for failed API requests (red entries)
4. Check if requests to `/api/*` are failing

### Step 3: Verify Backend Health
1. Open `http://localhost:8000/health` in browser
2. Should return `{"status": "healthy"}`
3. If not, backend is not running properly

### Step 4: Check Frontend Proxy
1. Open `http://localhost:3000/api/health` in browser
2. Should return the same as backend health check
3. If not, proxy configuration is incorrect

## Common Error Messages

### "Failed to fetch"
- Backend server is not running
- Network connectivity issues
- CORS configuration problems

### "useAuth is not a function"
- AuthProvider is not wrapping the app
- Import/export issues with AuthContext

### "Cannot read property of undefined"
- API response structure is unexpected
- Missing data in response

### "Module not found"
- Missing npm dependencies
- Incorrect import paths

## Quick Fixes

### If Backend is Down:
1. Start the backend server
2. Wait for it to fully load
3. Refresh the frontend page

### If Frontend is Broken:
1. Stop the dev server (Ctrl+C)
2. Clear browser cache
3. Restart the dev server: `npm run dev`

### If Both are Running but Still White Screen:
1. Check browser console for errors
2. Try a hard refresh (Ctrl+Shift+R)
3. Clear browser cache and cookies
4. Try in incognito/private mode

## Prevention

1. **Always start backend first** before frontend
2. **Check console logs** regularly during development
3. **Use ErrorBoundary** components to catch errors gracefully
4. **Test API endpoints** independently before integrating
5. **Keep dependencies updated** and consistent

## Getting Help

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Verify both backend and frontend are running
3. Test API endpoints directly
4. Check the network tab for failed requests
5. Look for any recent changes that might have caused the issue 