'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTrip, Trip } from '@/services/tripService';
import MarkdownItinerary from '@/components/MarkdownItinerary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTrip = async () => {
      try {
        setLoading(true);
        const id = params.id as string;
        const data = await getTrip(id);
        setTrip(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch trip:', err);
        
        // Handle 401 Unauthorized
        if (err.message?.includes('401')) {
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }
        
        if (err.message === 'Trip not found') {
          setError('Trip not found');
        } else {
          setError('Failed to load trip details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTrip();
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
        <Navbar />
        <div className="trip-detail-container">
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading trip details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
        <Navbar />
        <div className="trip-detail-container">
          <div className="error-container">
            <h2 className="error-title">⚠️ {error || 'Trip not found'}</h2>
            <p className="error-message">
              {error === 'Trip not found' 
                ? 'The trip you are looking for does not exist or has been deleted.'
                : 'Unable to load trip details. Please try again.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/trips" className="btn-primary">
                Back to Trips
              </Link>
              {error !== 'Trip not found' && (
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-secondary"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
      <Navbar />
      <div className="trip-detail-container">
      {/* Header Section */}
      <div className="trip-detail-header">
        <div className="trip-detail-header-content">
          <Link href="/trips" className="back-button">
            ← Back to Trips
          </Link>
          <h1 className="trip-detail-title">{trip.destination}</h1>
          <p className="trip-detail-date">Created on {formatDate(trip.created_at)}</p>
        </div>
      </div>

      {/* Trip Info Grid */}
      <div className="trip-info-grid">
        <div className="trip-info-card">
          <div className="trip-info-label">Total Budget</div>
          <div className="trip-info-value">{formatCurrency(trip.budget)}</div>
        </div>
        <div className="trip-info-card">
          <div className="trip-info-label">Duration</div>
          <div className="trip-info-value">{trip.days} {trip.days === 1 ? 'Day' : 'Days'}</div>
        </div>
        <div className="trip-info-card">
          <div className="trip-info-label">Daily Budget</div>
          <div className="trip-info-value">{formatCurrency(trip.daily_budget)}</div>
        </div>
        <div className="trip-info-card">
          <div className="trip-info-label">Travel Style</div>
          <div className="trip-info-value">{trip.travel_style}</div>
        </div>
        <div className="trip-info-card">
          <div className="trip-info-label">Category</div>
          <div className="trip-info-value">{trip.category}</div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="trip-recommendation-section">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          AI-Generated Itinerary
        </h2>
        <div className="trip-recommendation-content">
          {trip.ai_recommendation ? (
            <MarkdownItinerary content={trip.ai_recommendation} />
          ) : (
            <p className="no-recommendation">No AI recommendation available for this trip.</p>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="trip-detail-actions">
        <Link href="/trips" className="btn-secondary">
          View All Trips
        </Link>
        <Link href="/" className="btn-primary">
          Create New Trip
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
}
