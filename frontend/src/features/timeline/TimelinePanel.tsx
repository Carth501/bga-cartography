import type { TimelineEvent } from '../../types/models';

interface TimelinePanelProps {
  events: TimelineEvent[];
  focusedPinId: string | null;
  onSelectEvent: (pinId: string) => void;
}

export function TimelinePanel({ events, focusedPinId, onSelectEvent }: TimelinePanelProps) {
  return (
    <section className="timeline-panel border-top border-secondary-subtle px-3 py-3 px-lg-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
        <div>
          <p className="eyebrow mb-1 text-uppercase text-secondary">Timeline</p>
          <h2 className="h5 mb-0">Events linked to points of interest</h2>
        </div>
        <p className="mb-0 text-body-secondary small">Selecting an event should center the map on the associated pin.</p>
      </div>
      <div className="timeline-track d-flex gap-3 overflow-auto pb-2">
        {events.map((event) => {
          const active = event.pinId === focusedPinId;

          return (
            <button
              key={event.id}
              type="button"
              className={`timeline-card btn ${active ? 'btn-light text-dark' : 'btn-outline-secondary text-start'}`}
              onClick={() => onSelectEvent(event.pinId)}
            >
              <span className="d-block text-uppercase small fw-semibold mb-2">{event.year}</span>
              <span className="d-block fw-semibold mb-2">{event.label}</span>
              <span className="d-block small">{event.summary}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
