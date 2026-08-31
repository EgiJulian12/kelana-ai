"""
Quick backend test - run from backend folder
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal
from models.user import User
from models.trip import Trip

def test_backend():
    print("=" * 60)
    print("🔍 Backend Database Test")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # Test 1: Check users
        print("\n1. Testing Users table...")
        users = db.query(User).all()
        print(f"✅ Found {len(users)} users")
        for user in users:
            print(f"   - {user.email} (ID: {user.id})")
        
        # Test 2: Check trips
        print("\n2. Testing Trips table...")
        trips = db.query(Trip).all()
        print(f"✅ Found {len(trips)} trips")
        for trip in trips:
            print(f"   - ID {trip.id}: {trip.destination} ({trip.days} days, ${trip.budget})")
            print(f"     User ID: {trip.user_id}")
            print(f"     Created: {trip.created_at}")
        
        # Test 3: Test query that list_trips uses
        if users:
            test_user = users[0]
            print(f"\n3. Testing trips for user {test_user.email}...")
            user_trips = db.query(Trip).filter(Trip.user_id == test_user.id).all()
            print(f"✅ Found {len(user_trips)} trips for this user")
        
        # Test 4: Try to serialize a trip (check if all fields serializable)
        if trips:
            print("\n4. Testing trip serialization...")
            test_trip = trips[0]
            trip_dict = {
                'id': test_trip.id,
                'user_id': test_trip.user_id,
                'destination': test_trip.destination,
                'days': test_trip.days,
                'budget': test_trip.budget,
                'travel_style': test_trip.travel_style,
                'category': test_trip.category,
                'daily_budget': test_trip.daily_budget,
                'ai_recommendation': test_trip.ai_recommendation[:100] if test_trip.ai_recommendation else None,
                'created_at': str(test_trip.created_at)
            }
            print(f"✅ Trip serializable: {trip_dict}")
        
        print("\n" + "=" * 60)
        print("✅ All tests passed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_backend()
