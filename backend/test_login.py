"""
Test script to verify login credentials and create test users
"""
from database import SessionLocal
from models.user import User
from models.trip import Trip  # Import Trip to resolve relationship
from services.auth_service import hash_password, verify_password, register_user, login_user


def test_user_credentials(email: str, password: str):
    """Test if credentials are valid"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User {email} not found in database")
            return False
        
        is_valid = verify_password(password, user.password_hash)
        if is_valid:
            print(f"✅ Credentials valid for {email}")
            # Try to login
            result = login_user(db, email, password)
            print(f"✅ Login successful! Token: {result['access_token'][:50]}...")
            return True
        else:
            print(f"❌ Invalid password for {email}")
            return False
    finally:
        db.close()


def create_test_user(name: str, email: str, password: str):
    """Create a test user"""
    db = SessionLocal()
    try:
        user = register_user(db, name, email, password)
        print(f"✅ User created: {user.email} (ID: {user.id})")
        return user
    except ValueError as e:
        print(f"❌ Failed to create user: {e}")
        return None
    finally:
        db.close()


def list_all_users():
    """List all users in database"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\n📋 Total users: {len(users)}")
        for user in users:
            print(f"  - {user.email} (ID: {user.id}, Name: {user.name})")
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("🔐 Login Credentials Test")
    print("=" * 60)
    
    # List existing users
    list_all_users()
    
    print("\n" + "=" * 60)
    print("Testing existing credentials...")
    print("=" * 60)
    
    # Test known credentials
    print("\n1. Testing alice@email.com with password123:")
    test_user_credentials("alice@email.com", "password123")
    
    print("\n2. Testing egyjulian8@gmail.com with password123:")
    test_user_credentials("egyjulian8@gmail.com", "password123")
    
    print("\n3. Testing egyjulian8@gmail.com with 123456:")
    test_user_credentials("egyjulian8@gmail.com", "123456")
    
    # Create new test user if needed
    print("\n" + "=" * 60)
    print("Creating test user...")
    print("=" * 60)
    print("\nCreating testuser@example.com with password: testpass123")
    create_test_user("Test User", "testuser@example.com", "testpass123")
    
    print("\n" + "=" * 60)
    print("Final user list:")
    print("=" * 60)
    list_all_users()
    
    print("\n" + "=" * 60)
    print("✅ Test complete!")
    print("=" * 60)
    print("\n💡 Use these credentials to login:")
    print("   Email: alice@email.com")
    print("   Password: password123")
    print("\n   OR")
    print("\n   Email: testuser@example.com")
    print("   Password: testpass123")
