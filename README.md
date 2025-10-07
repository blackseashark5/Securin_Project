# Recipe Data Collection & API System

A production-grade full-stack application for managing and searching recipe data with a REST API backend and interactive React frontend.

🎥 [Watch the demo video on YouTube](https://youtu.be/46tmS5i5fOI)


## Features

### Backend API
- **RESTful API** with versioned endpoints (`/api/v1`)
- **Pagination** and sorting by rating
- **Advanced search** with comparison operators (`>=`, `<=`, `<`, `>`, `=`)
- Filter by: title, cuisine, rating, total_time, and calories
- **NaN handling** - converts invalid numeric values to NULL
- **Health check** endpoint for monitoring
- Built with Express.js and Supabase PostgreSQL

### Frontend
- **Interactive table** with star ratings and truncated titles
- **Column-level filters** with real-time search
- **Detail drawer** showing complete recipe information
- Expandable time breakdown (prep/cook time)
- **Nutrition table** with comprehensive information
- **Customizable pagination** (15, 20, 25, 30, 50 per page)
- Fallback screens for no results/data
- Built with React, TypeScript, and Tailwind CSS

### Database
- **PostgreSQL** with JSONB support for flexible data
- Optimized indexes for efficient querying
- Row Level Security (RLS) enabled
- Automatic timestamp tracking

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, Supabase Client
- **Database**: PostgreSQL (Supabase)
- **DevOps**: Docker, docker-compose

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd recipe-assessment
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

The `.env` file should already contain your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database setup**

The migration has already been applied to create the recipes table with proper schema and indexes.

5. **Load sample data**
```bash
node backend/etl.js --input recipes.json --batch-size 100
```

6. **Start the backend server**
```bash
node backend/server.js
```

The API will be available at `http://localhost:3001`

7. **Start the frontend (in a new terminal)**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Endpoints

#### 1. Get All Recipes (Paginated)

```http
GET /api/v1/recipes
```

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10) - Items per page

**Example Request:**
```bash
curl "http://localhost:3001/api/v1/recipes?page=1&limit=10"
```

**Example Response:**
```json
{
  "page": 1,
  "limit": 10,
  "total": 8,
  "data": [
    {
      "id": "uuid",
      "title": "Classic Margherita Pizza",
      "cuisine": "Italian",
      "rating": 4.9,
      "prep_time": 20,
      "cook_time": 25,
      "total_time": 45,
      "description": "A traditional Italian pizza...",
      "nutrients": {
        "calories": "285 kcal",
        "carbohydrateContent": "35 g",
        "proteinContent": "12 g"
      },
      "serves": "4 servings"
    }
  ]
}
```

#### 2. Search Recipes

```http
GET /api/v1/recipes/search
```

**Query Parameters:**
- `title` (string) - Partial match, case-insensitive
- `cuisine` (string) - Partial match, case-insensitive
- `rating` (string) - Supports operators: `>=4.5`, `<=3.0`, `=4.0`, `>3.5`, `<4.5`
- `total_time` (string) - Supports operators: `>=60`, `<=120`, etc.
- `calories` (string) - Supports operators: `>=300`, `<=500`, etc.
- `page` (integer, default: 1)
- `limit` (integer, default: 10)

**Example Requests:**

Search for pies with ≤400 calories and rating ≥4.5:
```bash
curl "http://localhost:3001/api/v1/recipes/search?calories=%3C%3D400&title=pie&rating=%3E%3D4.5"
```

Find quick recipes (≤30 min) from Thai cuisine:
```bash
curl "http://localhost:3001/api/v1/recipes/search?cuisine=Thai&total_time=%3C%3D30"
```

High-rated Italian recipes:
```bash
curl "http://localhost:3001/api/v1/recipes/search?cuisine=Italian&rating=%3E%3D4.8"
```

**Example Response:**
```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "data": [
    {
      "id": "uuid",
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "calories_int": 389,
      ...
    }
  ]
}
```

#### 3. Health Check

```http
GET /health
```

Returns server health status.

#### 4. API Documentation

```http
GET /api/v1/docs
```

Returns OpenAPI-style documentation.

## ETL Script

Parse and load recipe data from JSON files.

### Usage

```bash
node backend/etl.js --input <file.json> [--batch-size <size>]
```

### Options
- `--input` (required) - Path to JSON file
- `--batch-size` (optional, default: 100) - Number of records per batch

### Features
- Handles NaN values (converts to NULL)
- Extracts numeric calories from string (e.g., "389 kcal" → 389)
- Batch processing for performance
- Error reporting and summaries
- Transaction support

### Example

```bash
node backend/etl.js --input recipes.json --batch-size 50
```

## Database Schema

### recipes table

```sql
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuisine varchar(255),
  title varchar(1024),
  rating real,                    -- NULL for NaN
  prep_time integer,              -- minutes, NULL if invalid
  cook_time integer,              -- minutes, NULL if invalid
  total_time integer,             -- minutes, NULL if invalid
  description text,
  nutrients jsonb,                -- full nutrition as JSON
  serves varchar(255),
  calories_int integer,           -- normalized numeric calories
  url varchar(2048),
  country_state varchar(255),
  continent varchar(255),
  ingredients jsonb,              -- array of ingredients
  instructions jsonb,             -- array of instructions
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Indexes

- `idx_recipes_rating` - B-tree on rating (DESC NULLS LAST)
- `idx_recipes_calories` - B-tree on calories_int
- `idx_recipes_total_time` - B-tree on total_time
- `idx_recipes_cuisine` - B-tree on cuisine
- `idx_recipes_title` - GIN for full-text search
- `idx_recipes_nutrients` - GIN on nutrients JSONB

## Frontend Usage

### Recipe Table

- **Click any row** to view full recipe details
- **Use column filters** to search by specific criteria
- **Enter operators** in numeric fields (rating, time, calories):
  - `>=4.5` - greater than or equal
  - `<=60` - less than or equal
  - `=4.8` - exact match
  - `>100` - greater than
  - `<30` - less than
- **Click Search** to apply filters
- **Click Clear Filters** to reset

### Recipe Drawer

- Shows complete recipe information
- Click the **Total Time** section to expand prep/cook times
- View comprehensive nutrition information
- See full ingredients and step-by-step instructions
- Click outside or use the X button to close

### Pagination

- Select rows per page: 15, 20, 25, 30, or 50
- Navigate with Previous/Next buttons
- View current page and total pages

## Docker Deployment

### Using Docker Compose

1. **Build and start all services**
```bash
docker-compose up --build
```

2. **Load data (in another terminal)**
```bash
docker-compose exec backend node backend/etl.js --input recipes.json
```

3. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:3001
- Database: localhost:5432

### Individual Docker Builds

**Backend:**
```bash
docker build -f Dockerfile.backend -t recipe-backend .
docker run -p 3001:3001 --env-file .env recipe-backend
```

**Frontend:**
```bash
docker build -f Dockerfile.frontend -t recipe-frontend .
docker run -p 80:80 recipe-frontend
```

## Testing

### Manual API Testing

**Test health endpoint:**
```bash
curl http://localhost:3001/health
```

**Get first page of recipes:**
```bash
curl http://localhost:3001/api/v1/recipes?page=1&limit=5
```

**Search for Italian recipes:**
```bash
curl "http://localhost:3001/api/v1/recipes/search?cuisine=Italian"
```

**Find high-rated, low-calorie recipes:**
```bash
curl "http://localhost:3001/api/v1/recipes/search?rating=%3E%3D4.5&calories=%3C%3D400"
```

### Testing with Postman

Import the following as a collection:

1. GET `http://localhost:3001/health`
2. GET `http://localhost:3001/api/v1/recipes?page=1&limit=10`
3. GET `http://localhost:3001/api/v1/recipes/search?cuisine=Italian&rating=>=4.5`
4. GET `http://localhost:3001/api/v1/recipes/search?calories=<=400&total_time<=60`

## Project Structure

```
recipe-assessment/
├── backend/
│   ├── server.js           # Express API server
│   └── etl.js              # JSON parser & DB loader
├── src/
│   ├── App.tsx             # Main application
│   ├── types.ts            # TypeScript interfaces
│   └── components/
│       ├── RecipeTable.tsx # Table with filters
│       └── RecipeDrawer.tsx# Detail drawer
├── recipes.json            # Sample data
├── docker-compose.yml      # Multi-container setup
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
├── nginx.conf              # Nginx configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Design Decisions

### NaN Handling
All numeric fields (rating, prep_time, cook_time, total_time) handle NaN values by converting them to NULL in the database. This approach:
- Maintains data integrity
- Allows proper SQL queries with NULL handling
- Prevents arithmetic errors
- Enables meaningful sorting with NULLS LAST

### Normalized Calories
The `calories_int` column extracts numeric values from the calories string (e.g., "389 kcal" → 389) to:
- Enable efficient numeric filtering without JSONB parsing
- Support comparison operators
- Improve query performance with B-tree indexes

### JSONB for Flexibility
Storing nutrients, ingredients, and instructions as JSONB provides:
- Schema flexibility for varying data structures
- Efficient querying with GIN indexes
- Native JSON operations in PostgreSQL
- Easy frontend consumption

### Row Level Security
RLS is enabled with public read access, ensuring:
- Data security by default
- Easy extension to user-specific permissions
- Production-ready security model

## Troubleshooting

### Backend won't start
- Verify Supabase credentials in `.env`
- Check port 3001 is available
- Ensure Node.js 18+ is installed

### Frontend shows "Failed to fetch"
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API endpoint URLs

### ETL fails to load data
- Check JSON file format
- Verify database connection
- Look for errors in ETL output
- Ensure migrations have been applied

### No recipes showing
- Load sample data with ETL script
- Check database has records: visit Supabase dashboard
- Verify API returns data: `curl http://localhost:3001/api/v1/recipes`

### Docker issues
- Ensure Docker and docker-compose are installed
- Check `.env` file exists and has correct values
- Look at container logs: `docker-compose logs backend`

## Future Enhancements

- [ ] Unit and integration tests (Jest, React Testing Library)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Rate limiting and API authentication
- [ ] Cursor-based pagination for large datasets
- [ ] Full-text search with rankings
- [ ] Recipe image uploads
- [ ] User accounts and favorites
- [ ] Recipe ratings and reviews
- [ ] Export recipes (PDF, JSON)
- [ ] Advanced filtering (multiple cuisines, dietary restrictions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Contact

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using React, Express, and Supabase
