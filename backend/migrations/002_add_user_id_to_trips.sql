-- Migration: 002_add_user_id_to_trips
-- Drop and recreate trips table with complete schema including user_id

DROP TABLE IF EXISTS trips CASCADE;

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    days INTEGER NOT NULL,
    budget FLOAT NOT NULL,
    travel_style VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    daily_budget FLOAT NOT NULL,
    ai_recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_created_at ON trips(created_at DESC);