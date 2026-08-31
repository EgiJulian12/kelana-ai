"""
Reset password for a user
"""
import sys
from database import SessionLocal
from models.user import User
from models.trip import Trip
from services.auth_service import hash_password


def reset_password(email: str, new_password: str):
    """Reset password for a user"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User {email} not found")
            return False
        
        user.password_hash = hash_password(new_password)
        db.commit()
        print(f"✅ Password reset successful for {email}")
        print(f"   New password: {new_password}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python reset_password.py <email> <new_password>")
        print("\nExample:")
        print('  python reset_password.py egyjulian8@gmail.com newpassword123')
        sys.exit(1)
    
    email = sys.argv[1]
    new_password = sys.argv[2]
    
    print("=" * 60)
    print("🔐 Password Reset Tool")
    print("=" * 60)
    print(f"Email: {email}")
    print(f"New Password: {new_password}")
    print("=" * 60)
    
    reset_password(email, new_password)
