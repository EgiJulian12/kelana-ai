import Link from 'next/link';
import { Trip } from '@/services/tripService';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get destination flag/icon
  const getDestinationIcon = (destination: string): string => {
    if (!destination) return '🌍';
    const dest = destination.toLowerCase();
    if (dest.includes('japan') || dest.includes('tokyo') || dest.includes('kyoto') || dest.includes('osaka')) return '🇯🇵';
    if (dest.includes('bali') || dest.includes('indonesia') || dest.includes('jakarta')) return '🇮🇩';
    if (dest.includes('paris') || dest.includes('france')) return '🇫🇷';
    if (dest.includes('rome') || dest.includes('italy') || dest.includes('venice')) return '🇮🇹';
    if (dest.includes('london') || dest.includes('uk') || dest.includes('england')) return '🇬🇧';
    if (dest.includes('swiss') || dest.includes('zurich') || dest.includes('switzerland')) return '🇨🇭';
    if (dest.includes('usa') || dest.includes('america') || dest.includes('new york')) return '🇺🇸';
    if (dest.includes('spain') || dest.includes('barcelona') || dest.includes('madrid')) return '🇪🇸';
    if (dest.includes('thailand') || dest.includes('bangkok') || dest.includes('phuket')) return '🇹🇭';
    if (dest.includes('singapore')) return '🇸🇬';
    if (dest.includes('korea') || dest.includes('seoul')) return '🇰🇷';
    if (dest.includes('china') || dest.includes('beijing') || dest.includes('shanghai')) return '🇨🇳';
    return '🌍'; // Default world icon
  };

  // Get category color and badge
  const getCategoryStyle = (category: string): { color: string; bg: string; border: string } => {
    if (!category) {
      return { color: '#c4b5fd', bg: 'rgba(124, 58, 237, 0.15)', border: 'rgba(124, 58, 237, 0.3)' };
    }
    const cat = category.toLowerCase();
    if (cat.includes('backpack') || cat.includes('budget')) {
      return { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.3)' };
    }
    if (cat.includes('standard') || cat.includes('moderate')) {
      return { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.3)' };
    }
    if (cat.includes('luxury') || cat.includes('premium')) {
      return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' };
    }
    return { color: '#c4b5fd', bg: 'rgba(124, 58, 237, 0.15)', border: 'rgba(124, 58, 237, 0.3)' };
  };

  // Get travel style badge
  const getTravelStyleBadge = (style: string): { emoji: string; label: string; color: string } => {
    if (!style) {
      return { emoji: '✈️', label: 'Travel', color: '#a78bfa' };
    }
    const s = style.toLowerCase();
    if (s.includes('family')) return { emoji: '👨‍👩‍👧', label: 'Family', color: '#22d3ee' };
    if (s.includes('solo')) return { emoji: '🎒', label: 'Solo', color: '#a78bfa' };
    if (s.includes('couple')) return { emoji: '💑', label: 'Couple', color: '#f472b6' };
    if (s.includes('adventure')) return { emoji: '🧗', label: 'Adventure', color: '#10b981' };
    if (s.includes('cultural')) return { emoji: '🏛️', label: 'Cultural', color: '#8b5cf6' };
    if (s.includes('luxury')) return { emoji: '💎', label: 'Luxury', color: '#fbbf24' };
    if (s.includes('backpack')) return { emoji: '🎒', label: 'Backpacker', color: '#22d3ee' };
    if (s.includes('culinary')) return { emoji: '🍜', label: 'Foodie', color: '#f59e0b' };
    return { emoji: '✈️', label: style, color: '#a78bfa' };
  };

  const categoryStyle = getCategoryStyle(trip.category);
  const travelStyleBadge = getTravelStyleBadge(trip.travel_style);

  return (
    <Link href={`/trips/${trip.id}`} className="trip-card">
      {/* Destination Header with Flag */}
      <div className="trip-card-header">
        <div className="trip-card-title-row">
          <span className="destination-flag">{getDestinationIcon(trip.destination)}</span>
          <h3 className="trip-card-title">{trip.destination || 'Unknown Destination'}</h3>
        </div>
        <span 
          className="trip-card-category"
          style={{
            color: categoryStyle.color,
            backgroundColor: categoryStyle.bg,
            borderColor: categoryStyle.border
          }}
        >
          {trip.category || 'Standard'}
        </span>
      </div>

      {/* Budget Display - Enhanced */}
      <div className="trip-card-budget-highlight">
        <div className="budget-main">
          <span className="budget-label">Total Budget</span>
          <span className="budget-amount">{formatCurrency(trip.budget)}</span>
        </div>
        <div className="budget-daily">
          <span className="budget-daily-amount">{formatCurrency(trip.daily_budget)}</span>
          <span className="budget-daily-label">/day</span>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="trip-card-details">
        <div className="trip-card-detail-item">
          <span className="detail-icon">📅</span>
          <div className="detail-content">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{trip.days || 0} {(trip.days === 1) ? 'day' : 'days'}</span>
          </div>
        </div>
        <div className="trip-card-detail-item">
          <span className="detail-icon">{travelStyleBadge.emoji}</span>
          <div className="detail-content">
            <span className="detail-label">Travel Style</span>
            <span 
              className="detail-value"
              style={{ color: travelStyleBadge.color }}
            >
              {travelStyleBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="trip-card-footer">
        <span className="trip-card-date">
          <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(trip.created_at)}
        </span>
        <span className="view-details-arrow">→</span>
      </div>
    </Link>
  );
}
