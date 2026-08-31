import TripCard from './TripCard';
import { Trip } from '@/services/tripService';

interface TripListProps {
  trips: Trip[];
  emptyMessage?: string;
  emptyIcon?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export default function TripList({ 
  trips, 
  emptyMessage = "No trips found",
  emptyIcon = "✈️",
  showCreateButton = true,
  onCreateClick 
}: TripListProps) {
  
  if (trips.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">{emptyIcon}</div>
        <h2 className="empty-state-title">{emptyMessage}</h2>
        <p className="empty-state-description">
          Start planning your next adventure by creating your first trip!
        </p>
        {showCreateButton && (
          <button
            onClick={onCreateClick}
            className="btn-primary"
          >
            Create Your First Trip
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="trips-grid">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
