import Link from 'next/link';
import { Trip } from '@/services/tripService';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
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

  return (
    <Link href={`/trips/${trip.id}`} className="trip-card">
      <div className="trip-card-header">
        <h3 className="trip-card-title">{trip.destination}</h3>
        <span className="trip-card-category">{trip.category}</span>
      </div>
      
      <div className="trip-card-details">
        <div className="trip-card-detail-item">
          <span className="detail-label">Budget</span>
          <span className="detail-value">{formatCurrency(trip.budget)}</span>
        </div>
        <div className="trip-card-detail-item">
          <span className="detail-label">Duration</span>
          <span className="detail-value">{trip.days} {trip.days === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="trip-card-detail-item">
          <span className="detail-label">Style</span>
          <span className="detail-value">{trip.travel_style}</span>
        </div>
        <div className="trip-card-detail-item">
          <span className="detail-label">Daily Budget</span>
          <span className="detail-value">{formatCurrency(trip.daily_budget)}</span>
        </div>
      </div>

      <div className="trip-card-footer">
        <span className="trip-card-date">Created: {formatDate(trip.created_at)}</span>
      </div>
    </Link>
  );
}
