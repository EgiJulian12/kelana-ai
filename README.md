# KelanaAI

AI-powered travel planning application that helps users create personalized travel itineraries using AWS Bedrock.

## Features

- 🤖 AI-generated travel itineraries with structured daily plans
- 💰 Budget-based trip planning
- 🗺️ Multi-destination support
- 🎨 Modern, clean UI
- 📊 PostgreSQL database for trip persistence

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Database
- **AWS Bedrock** - AI model for itinerary generation
- **boto3** - AWS SDK

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (running on port 5434)
- AWS Bedrock credentials

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv .venv
```

3. Activate virtual environment:
```bash
# Windows
.\.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file with the following:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/kelana_db
AWS_BEARER_TOKEN_BEDROCK=your_bearer_token_here
AWS_REGION=ap-southeast-2
MODEL_ID=amazon.nova-lite-v1:0
```

6. Create PostgreSQL database:
```sql
CREATE DATABASE kelana_db;
```

7. Run the server:
```bash
uvicorn main:app --reload
```

Backend will run at: http://localhost:8000

API Documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## API Endpoints

### Main Endpoints

- `GET /` - Welcome endpoint
- `GET /health` - Health check
- `POST /api/v1/trips` - Create new trip with AI recommendation
- `GET /api/v1/trips` - List all trips
- `GET /api/v1/trips/{trip_id}` - Get specific trip
- `POST /api/v1/trips/{trip_id}/generate` - Generate AI recommendation for existing trip

### Request Example

```json
POST /api/v1/trips
{
  "destinations": ["Tokyo", "Kyoto"],
  "days": 5,
  "budget": 2000,
  "month": "March",
  "travel_style": "cultural"
}
```

### Response Example

```json
{
  "id": 1,
  "destination": "Tokyo, Kyoto",
  "days": 5,
  "budget": 2000.0,
  "category": "budget",
  "daily_budget": 400.0,
  "ai_recommendation": "## Day 1: Tokyo\n\n### Morning activities:\n- Visit Senso-ji Temple..."
}
```

## AI Prompt Structure

The AI generates structured daily plans with:
- **Morning activities** - 2-3 specific activities per day
- **Afternoon activities** - Cultural sites and local experiences
- **Evening activities** - Dinner spots and nightlife
- **Budget breakdown** - Daily estimated costs
- **Food recommendations** - Local cuisine suggestions
- **Transportation** - Getting around tips

Response format: Markdown with headers (##) and bullet lists (-)

## Database Schema

### Trip Model
```python
- id: Integer (Primary Key)
- destination: String
- days: Integer
- budget: Float
- category: String
- daily_budget: Float
- ai_recommendation: Text (nullable)
```

## Usage

1. Open http://localhost:3000 in your browser
2. Fill in the trip details:
   - Destination (can be multiple, comma-separated)
   - Budget in USD
   - Number of days
   - Travel month
   - Travel style (cultural, adventure, luxury, etc.)
3. Click "Generate AI Trip"
4. View your personalized itinerary with AI recommendations

## Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Code Style
- Backend: Follow PEP 8
- Frontend: ESLint with Next.js config

## License

This project is licensed under the MIT License.
