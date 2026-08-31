interface DayCardProps {
  dayNumber: number;
  title?: string;
  activities: string[];
  notes?: string;
}

export default function DayCard({ dayNumber, title, activities, notes }: DayCardProps) {
  return (
    <div className="day-card">
      {/* Day Header */}
      <div className="day-card-header">
        <div className="day-badge">
          DAY {dayNumber}
        </div>
        {title && (
          <h3 className="day-title">{title}</h3>
        )}
      </div>

      {/* Activities List */}
      <div className="day-activities">
        {activities.map((activity, index) => (
          <div key={index} className="day-activity-item">
            <span className="activity-bullet">›</span>
            <span className="activity-text">{activity}</span>
          </div>
        ))}
      </div>

      {/* Optional Notes */}
      {notes && (
        <div className="day-notes">
          <span className="notes-icon">💡</span>
          <p className="notes-text">{notes}</p>
        </div>
      )}
    </div>
  );
}
