'use client';

import { useEffect, useState, useMemo } from 'react';
import { getTrips, Trip } from '@/services/tripService';
import TripCard from '@/components/TripCard';
import Link from 'next/link';

type SortOption = 'latest' | 'oldest' | 'budget-desc' | 'budget-asc';

const ITEMS_PER_PAGE = 9; // 3x3 grid

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await getTrips();
        setTrips(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter and sort trips
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];

    // Filter by search query (destination or travel style)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (trip) =>
          trip.destination.toLowerCase().includes(query) ||
          trip.travel_style.toLowerCase().includes(query)
      );
    }

    // Sort trips
    result.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'budget-desc':
          return b.budget - a.budget;
        case 'budget-asc':
          return a.budget - b.budget;
        default:
          return 0;
      }
    });

    return result;
  }, [trips, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTrips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrips = filteredAndSortedTrips.slice(startIndex, endIndex);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="trips-container">
        <div className="trips-header">
          <h1 className="trips-title">My Trips</h1>
          <Link href="/" className="btn-primary">
            Create New Trip
          </Link>
        </div>
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trips-container">
        <div className="trips-header">
          <h1 className="trips-title">My Trips</h1>
          <Link href="/" className="btn-primary">
            Create New Trip
          </Link>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="trips-container">
        <div className="trips-header">
          <h1 className="trips-title">My Trips</h1>
          <Link href="/" className="btn-primary">
            Create New Trip
          </Link>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <h2 className="empty-state-title">No trips yet</h2>
          <p className="empty-state-description">
            Start planning your next adventure by creating your first trip!
          </p>
          <Link href="/" className="btn-primary">
            Create Your First Trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trips-container">
      {/* Animated Background */}
      <div className="trips-bg-layer">
        <div className="bg-grid"></div>
        <div className="bg-orb-1"></div>
        <div className="bg-orb-2"></div>
        <div className="bg-orb-3"></div>
      </div>

      <div className="trips-content">
        <div className="trips-header">
          <h1 className="trips-title">My Trips</h1>
          <Link href="/" className="btn-primary">
            Create New Trip
          </Link>
        </div>

      {/* Search and Sort Controls */}
      <div className="trips-controls">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search trips by destination or travel style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="sort-dropdown">
          <label htmlFor="sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="latest">Latest (newest first)</option>
            <option value="oldest">Oldest (first trip first)</option>
            <option value="budget-desc">Highest Budget</option>
            <option value="budget-asc">Lowest Budget</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      {searchQuery && (
        <div className="search-results-info">
          Found {filteredAndSortedTrips.length} trip{filteredAndSortedTrips.length !== 1 ? 's' : ''} 
          {filteredAndSortedTrips.length === 0 && ' matching your search'}
        </div>
      )}

      {/* Trips Grid */}
      {filteredAndSortedTrips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2 className="empty-state-title">No trips found</h2>
          <p className="empty-state-description">
            Try adjusting your search or create a new trip.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <div className="trips-grid">
            {currentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
                aria-label="Previous page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return <span key={page} className="pagination-ellipsis">...</span>;
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
                aria-label="Next page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}

          {/* Page info */}
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedTrips.length)} of {filteredAndSortedTrips.length} trips
          </div>
        </>
      )}
      </div>
    </div>
  );
}
