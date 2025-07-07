# Development Guide

This guide explains how to work with the CryptoBot Pro project structure and development workflow.

## 📁 Project Structure Overview

```
AI agent/
├── ETH-backend/          # FastAPI Backend (Python)
├── ETH-frontend/         # React Frontend (TypeScript)
├── README.md            # Main project documentation
├── CHANGELOG.md         # Version history and changes
├── DEVELOPMENT.md       # This development guide
├── .gitignore          # Git ignore rules
├── start.sh            # Development startup script
└── model.txt           # AI model configuration
```

## 🚀 Quick Start

### Option 1: Use the Startup Script
```bash
./start.sh
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd ETH-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd ETH-frontend
npm install
npm run dev
```

## 🔧 Development Workflow

### Backend Development (ETH-backend/)

#### Adding New API Endpoints
1. **Create Route**: Add new route file in `app/routes/`
2. **Create Schema**: Add Pydantic schemas in `app/schemas/`
3. **Create Model**: Add database models in `app/models/` if needed
4. **Update Main**: Register routes in `app/main.py`

Example new route:
```python
# app/routes/trading.py
from fastapi import APIRouter, Depends
from app.schemas.trading import SwapRequest, SwapResponse

router = APIRouter(prefix="/trading", tags=["trading"])

@router.post("/swap", response_model=SwapResponse)
async def execute_swap(request: SwapRequest):
    # Implementation here
    pass
```

#### Database Migrations
```bash
cd ETH-backend
# Create migration
alembic revision --autogenerate -m "Add trading table"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

#### Testing Backend
```bash
cd ETH-backend
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

### Frontend Development (ETH-frontend/)

#### Adding New Components
1. **Create Component**: Add new component in `src/components/`
2. **Add API Functions**: Update `src/utils/api.ts` with new endpoints
3. **Add Types**: Define TypeScript interfaces for API responses
4. **Update Pages**: Integrate component in appropriate pages

Example new component:
```typescript
// src/components/NewFeature.tsx
import { useState, useEffect } from 'react';
import { newFeatureAPI } from '@/utils/api';

interface NewFeatureData {
  id: number;
  name: string;
  value: number;
}

const NewFeature = () => {
  const [data, setData] = useState<NewFeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await newFeatureAPI.getData();
        setData(response);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}: {item.value}</div>
      ))}
    </div>
  );
};

export default NewFeature;
```

#### Adding New API Functions
```typescript
// src/utils/api.ts
export const newFeatureAPI = {
  getData: async () => {
    const res = await fetch(`${API_BASE}/new-feature/data`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  },
  
  createItem: async (data: CreateItemRequest) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/new-feature/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create item');
    return res.json();
  },
};
```

#### Testing Frontend
```bash
cd ETH-frontend
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🔄 API Integration Pattern

### Frontend → Backend Communication

1. **API Function**: Define in `src/utils/api.ts`
2. **TypeScript Interface**: Define response types
3. **Component Integration**: Use in React components
4. **Error Handling**: Implement proper error states

### Example Integration

```typescript
// 1. API Function
export const userAPI = {
  getProfile: async (userId: number) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/user/${userId}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
};

// 2. TypeScript Interface
interface UserProfile {
  id: number;
  username: string;
  email: string;
  balance: number;
}

// 3. Component Usage
const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getProfile(1);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Component JSX...
};
```

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug mode
export DEBUG=true

# Run with debug logging
python -m uvicorn app.main:app --reload --log-level debug

# Check logs
tail -f logs/app.log
```

### Frontend Debugging
```bash
# Enable React DevTools
# Install browser extension

# Enable TypeScript strict mode
# Check tsconfig.json

# Debug API calls
# Check browser Network tab
# Check browser Console for errors
```

### Common Issues

#### White Screen After Login
- Check if `AuthProvider` is wrapping `App` in `main.tsx`
- Verify JWT token is being stored in localStorage
- Check browser console for JavaScript errors

#### API Connection Issues
- Verify backend is running on port 8000
- Check CORS configuration in backend
- Verify proxy configuration in `vite.config.ts`

#### Database Issues
- Check database connection string
- Verify migrations are applied
- Check database file permissions

## 📝 Code Standards

### Backend (Python)
- Use type hints for all functions
- Follow PEP 8 style guide
- Use async/await for database operations
- Add docstrings to all functions
- Use Pydantic for data validation

### Frontend (TypeScript)
- Use TypeScript strict mode
- Define interfaces for all API responses
- Use functional components with hooks
- Implement proper error boundaries
- Follow consistent naming conventions

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test thoroughly

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

## 🚀 Deployment

### Backend Deployment
1. Set up production database (PostgreSQL)
2. Configure environment variables
3. Run database migrations
4. Deploy with gunicorn/uvicorn
5. Set up reverse proxy (nginx)

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy `dist` folder to hosting service
3. Configure API proxy for production backend
4. Set up custom domain and SSL

## 📚 Resources

### Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

### Frontend
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)

### Development Tools
- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - State debugging 