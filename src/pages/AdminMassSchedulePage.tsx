import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { apiFetch } from '../utils/api';

type MassEntry = {
  id?: number;
  day?: string;
  title?: string;
  massType: string;
  celebrant: string;
  date: string;
  time: string;
  description: string;
  requester: string;
  stipend: string;
  notes: string;
};

const initialFormState: MassEntry = {
  massType: 'Daily Mass',
  celebrant: 'Fr. Niel Limbaco',
  date: '',
  time: '08:00 AM',
  description: '',
  requester: '',
  stipend: 'Standard',
  notes: '',
};

function AdminMassSchedulePage() {
  const [schedule, setSchedule] = useState<MassEntry[]>([]);
  const [addedMasses, setAddedMasses] = useState<MassEntry[]>([]);
  const [massForm, setMassForm] = useState<MassEntry>(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    apiFetch('/schedules')
      .then((data) => setSchedule(data))
      .catch((error) => setSuccessMessage(`Unable to load schedule: ${error.message}`));
  }, []);

  const updateForm = (field: keyof MassEntry, value: string) => {
    setMassForm((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage('');
  };

  const handleAddMass = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const dayName = massForm.date
        ? new Date(massForm.date).toLocaleDateString('en-US', { weekday: 'short' })
        : 'New';

      const newSchedule = await apiFetch('/schedules', {
        method: 'POST',
        body: JSON.stringify({
          event_date: massForm.date,
          day: dayName,
          time: massForm.time,
          title: massForm.massType,
          description: massForm.description,
          celebrant: massForm.celebrant,
          requester: massForm.requester,
          stipend: massForm.stipend,
          notes: massForm.notes,
        }),
      });

      setAddedMasses((prev) => [massForm, ...prev]);
      setSchedule((prev) => [newSchedule, ...prev]);
      setMassForm(initialFormState);
      setShowForm(false);
      setSuccessMessage('Mass added successfully.');
    } catch (error) {
      setSuccessMessage(`Could not add mass: ${(error as Error).message}`);
    }
  };

  return (
    <MainLayout>
      <TopBar
        title="Mass Schedule"
        subtitle="Manage priest assignments, mass intentions, and the parish liturgical calendar."
        badge="Admin Mass Schedule"
      />

      <section className="schedule-page">
        <div className="schedule-header">
          <div className="schedule-tabs">
            <button className="button button-secondary active">Weekly View</button>
            <button className="button button-secondary">Monthly View</button>
          </div>
          <div className="schedule-filters">
            <span className="filter-pill active">All Services</span>
            <span className="filter-pill">Ordinary Time</span>
            <span className="filter-pill">Feasts</span>
          </div>
          <div className="schedule-actions">
            <button className="button button-primary" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Add Mass'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-card panel" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="section-heading">Add Mass</div>
                  <p className="body-text">Schedule a liturgy and assign prayer intentions.</p>
                </div>
                <button type="button" className="modal-close-button" onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleAddMass} className="modal-form-grid">
                <div className="field-card">
                  <span className="small-label">Mass Type</span>
                  <select
                    value={massForm.massType}
                    onChange={(event) => updateForm('massType', event.target.value)}
                  >
                    <option>Daily Mass</option>
                    <option>Sunday Mass</option>
                    <option>Wedding Mass</option>
                    <option>Baptism Mass</option>
                  </select>
                </div>

                <div className="field-card">
                  <span className="small-label">Celebrant Assignment</span>
                  <select
                    value={massForm.celebrant}
                    onChange={(event) => updateForm('celebrant', event.target.value)}
                  >
                    <option>Fr. Niel Limbaco</option>
                    <option>Fr. Thomas Aquinas</option>
                    <option>Fr. Miguel Santos</option>
                  </select>
                </div>

                <div className="field-card">
                  <span className="small-label">Date</span>
                  <input
                    type="date"
                    value={massForm.date}
                    onChange={(event) => updateForm('date', event.target.value)}
                  />
                </div>

                <div className="field-card">
                  <span className="small-label">Time</span>
                  <input
                    type="time"
                    value={massForm.time}
                    onChange={(event) => updateForm('time', event.target.value)}
                  />
                </div>

                <div className="modal-fieldset full-width">
                  <div className="modal-fieldset-heading">Mass Intentions</div>
                  <textarea
                    rows={4}
                    value={massForm.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="e.g. For the soul of John Doe, In Thanksgiving for the Smith family..."
                  />
                </div>

                <div className="field-card">
                  <span className="small-label">Requester's Name</span>
                  <input
                    type="text"
                    value={massForm.requester}
                    onChange={(event) => updateForm('requester', event.target.value)}
                    placeholder="Name of individual or family"
                  />
                </div>

                <div className="field-card">
                  <span className="small-label">Stipend Status</span>
                  <select
                    value={massForm.stipend}
                    onChange={(event) => updateForm('stipend', event.target.value)}
                  >
                    <option>Standard</option>
                    <option>Waived</option>
                  </select>
                </div>

                <div className="modal-fieldset full-width">
                  <div className="modal-fieldset-heading">Internal Administrative Notes</div>
                  <textarea
                    rows={3}
                    value={massForm.notes}
                    onChange={(event) => updateForm('notes', event.target.value)}
                    placeholder="Add liturgical or scheduling notes..."
                  />
                </div>

                <div className="modal-footer full-width">
                  <button type="button" className="button button-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="button button-primary" type="submit">
                    Schedule Mass
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {successMessage && <div className="success-banner">{successMessage}</div>}

        <div className="schedule-board">
          <div className="schedule-range">
            <span>October 21 – 27, 2024</span>
            <button className="ghost-link">Go to Today</button>
          </div>
          <div className="schedule-grid">
            {schedule.map((slot, index) => (
              <div
                key={`${slot.day}-${slot.time}-${index}`}
                className={`schedule-card ${slot.day === 'Wed' ? 'active-day' : ''}`}
              >
                <span className="schedule-time">{slot.time}</span>
                <strong>{slot.title}</strong>
                <p className="body-text">{slot.day}</p>
              </div>
            ))}
          </div>
        </div>

        {addedMasses.length > 0 && (
          <section className="panel added-mass-list">
            <div className="section-heading">Recently Added Masses</div>
            <div className="list-card">
              {addedMasses.map((mass, index) => (
                <div key={`${mass.date}-${mass.time}-${index}`} className="list-item">
                  <div>
                    <strong>{mass.massType}</strong>
                    <span className="body-text">
                      {mass.date} • {mass.time} • {mass.celebrant}
                    </span>
                    <p className="body-text small">{mass.description || 'No description provided'}</p>
                  </div>
                  <span className="badge success">{mass.stipend}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/admin-dashboard" className="button button-secondary">
          Back to Admin Dashboard
        </Link>
      </div>
    </MainLayout>
  );
}

export default AdminMassSchedulePage;
