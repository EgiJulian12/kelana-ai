"""
check_db.py — Cek struktur database

Usage:
    python check_db.py
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def check_database():
    """Cek tabel dan struktur database."""
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn.cursor() as cur:
            print("📊 Daftar Tabel:")
            print("=" * 60)
            
            # List all tables
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            
            tables = cur.fetchall()
            for (table_name,) in tables:
                print(f"\n✓ {table_name}")
                
                # Get column info
                cur.execute("""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns
                    WHERE table_name = %s
                    ORDER BY ordinal_position;
                """, (table_name,))
                
                columns = cur.fetchall()
                for col_name, col_type, nullable in columns:
                    null_str = "NULL" if nullable == "YES" else "NOT NULL"
                    print(f"    - {col_name:<20} {col_type:<20} {null_str}")
            
            print("\n" + "=" * 60)
            print("✅ Database struktur OK!")
            
    except Exception as exc:
        print(f"❌ Error: {exc}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    check_database()
