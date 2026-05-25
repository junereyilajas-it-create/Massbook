import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, pool } from './db.js';

dotenv.config();

await initializeDatabase();

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

function formatTime(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const parsed = new Date(`1970-01-01T${value}`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return value;
  }
  return value instanceof Date
    ? value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : String(value);
}

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), password, phone ?? '']
    );

    res.status(201).json({ id: result.insertId, name, email: email.toLowerCase(), phone: phone ?? '', role: 'user' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A user with that email already exists.' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await pool.query('SELECT id, name, email, phone, role FROM users WHERE email = ? AND password = ?', [email.toLowerCase(), password]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT event_id AS id, requester_name AS title, DATE_FORMAT(event_date, '%b %d, %Y') AS date,
             TIME_FORMAT(start_time, '%h:%i %p') AS time, notes AS location, status
      FROM events
      ORDER BY event_date ASC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

app.get('/api/schedules', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date, day, time, title, description, celebrant, requester, stipend, notes
      FROM schedules
      ORDER BY event_date ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
});

app.post('/api/schedules', async (req, res) => {
  try {
    const { event_date, day, time, title, description, celebrant, requester, stipend, notes } = req.body;
    if (!event_date || !time || !title) {
      return res.status(400).json({ message: 'Required fields: event_date, time, title.' });
    }

    const [result] = await pool.query(
      `INSERT INTO schedules (event_date, day, time, title, description, celebrant, requester, stipend, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [event_date, day, time, title, description ?? '', celebrant ?? '', requester ?? '', stipend ?? '', notes ?? '']
    );

    const [rows] = await pool.query('SELECT * FROM schedules WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.event_id AS id,
        et.name AS type,
        e.requester_name AS name,
        DATE_FORMAT(e.event_date, '%b %d, %Y') AS requested,
        DATE_FORMAT(e.created_at, '%b %d, %Y') AS submitted,
        e.status
      FROM events e
      LEFT JOIN event_types et ON et.event_type_id = e.event_type_id
      WHERE e.status = 'pending'
      ORDER BY e.created_at ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

app.get('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM events WHERE event_id = ?', [id]);
    const request = rows[0];
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const response = {
      ...request,
      eventTitle: request.title || request.type || 'Event Booking',
      massType: request.type || 'Event',
      preferredCelebrant: request.celebrant || 'To be assigned',
      location: request.location || 'Parish Hall',
      proposedDate: request.event_date ? new Date(request.event_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
      proposedTime: formatTime(request.start_time),
      expectedGuests: request.expected_guests || 'TBD',
      notes: request.notes || 'No additional notes.',
      primaryContact: {
        name: request.requester_name || 'Parishioner',
        email: request.email || 'unknown@massbook.church',
        phone: request.contact_number || '(555) 000-0000',
        role: 'Primary Contact',
        tag: 'Requester',
      },
      secondaryContact: {
        name: 'Parish Coordinator',
        email: 'coordinator@massbook.church',
        phone: '(555) 101-2020',
        role: 'Coordinator',
        tag: 'Admin',
      },
      documents: [
        { label: 'Baptismal Certificate', fileType: 'PDF', size: '1.2 MB', uploaded: 'Uploaded Sep 12', status: 'view' },
        { label: 'Confirmation Record', fileType: 'PDF', size: '1.4 MB', uploaded: 'Uploaded Sep 12', status: 'view' },
        { label: 'Pre-Marital Counseling Certificate', fileType: 'PDF', size: '0.8 MB', uploaded: 'Uploaded Sep 23', status: 'view' },
        { label: 'Civil Marriage License', fileType: 'PDF', size: 'Missing', uploaded: 'Required before final approval', status: 'missing' },
      ],
      history: [
        { title: 'Request Created', summary: 'Submitted request created and assigned for review.', timestamp: 'Sep 02, 2024 • 10:28 AM' },
        { title: 'Documents Updated', summary: 'Supplementary documents uploaded by parishioner.', timestamp: 'Sep 23, 2024 • 11:12 AM' },
        { title: 'Assigned to Admin Review', summary: 'Request moved to pending review queue.', timestamp: 'Oct 02, 2024 • 09:00 AM' },
      ],
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error: error.message });
  }
});

app.post('/api/requests/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the event details first
    const [eventRows] = await pool.query('SELECT * FROM events WHERE event_id = ?', [id]);
    if (!eventRows || eventRows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const event = eventRows[0];
    
    // Update event status to approved
    await pool.query('UPDATE events SET status = ? WHERE event_id = ?', ['approved', id]);
    
    // Create schedule entry from approved event
    const scheduleDate = event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(event.event_date || new Date()).toLocaleDateString('en-US', { weekday: 'long' });
    
    await pool.query(
      `INSERT INTO schedules (event_date, day, time, title, description, celebrant, requester, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        scheduleDate,
        dayOfWeek,
        event.start_time || '10:00:00',
        // Use the event requested for this specific request id (fallback to event type)
        event.title || event.type || event.event_type_id || 'Event' ,
        event.description || '',
        event.celebrant || 'To be assigned',
        event.requester_name || '',
        event.notes || ''
      ]
    );
    
    res.json({ message: 'Request approved and added to schedule.' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error: error.message });
  }
});

app.get('/api/pending-approvals/count', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT COUNT(*) as count FROM events WHERE status = 'pending'
    `);
    const count = rows[0]?.count ?? 0;
    res.json({ pending: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending count', error: error.message });
  }
});

app.post('/api/requests/:id/decline', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE events SET status = ? WHERE event_id = ?', ['declined', id]);
    res.json({ message: 'Request declined.' });
  } catch (error) {
    res.status(500).json({ message: 'Error declining request', error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    console.log('booking payload', req.body);
    const {
      event_type_id,
      requester_name,
      email,
      contact_number,
      event_date,
      start_time,
      end_time,
      notes,
      location,
      type,
      title,
      description,
      submitted_date,
    } = req.body;

    if (!event_type_id || !requester_name || !event_date || !start_time) {
      return res.status(400).json({ message: 'Missing required booking values' });
    }

    const eventDate = new Date(`${event_date}T00:00:00`);
    if (Number.isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: 'Invalid event date.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate <= today) {
      return res.status(400).json({ message: 'Invalid date. You can only book events for future dates (tomorrow or later).' });
    }

    const currentDate = typeof submitted_date === 'string' && submitted_date.trim()
      ? submitted_date.trim()
      : new Date().toISOString().split('T')[0];

    const normalizedType = typeof type === 'string' ? type.trim() : '';
    const normalizedTitle = typeof title === 'string' && title.trim() ? title.trim() : (normalizedType || 'Event');
    const normalizedDescription = typeof description === 'string' ? description.trim() : '';
    const normalizedLocation = typeof location === 'string' ? location.trim() : '';
    const normalizedNotes = typeof notes === 'string' ? notes.trim() : '';

    const [result] = await pool.query(
      `INSERT INTO events (
        event_type_id,
        type,
        title,
        description,
        status,
        requested_date,
        submitted_date,
        requester_name,
        email,
        contact_number,
        event_date,
        start_time,
        end_time,
        location,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        event_type_id,
        normalizedType,
        normalizedTitle,
        normalizedDescription || null,
        'pending',
        currentDate,
        currentDate,
        requester_name,
        email ?? '',
        contact_number ?? '',
        event_date,
        start_time,
        end_time ?? start_time,
        normalizedLocation,
        normalizedNotes,
      ]
    );

    const [rows] = await pool.query('SELECT event_id, requester_name, status FROM events WHERE event_id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

app.post('/api/support/ticket', async (req, res) => {
  try {
    const { name, parishId, subject, message } = req.body;
    if (!name || !parishId || !subject || !message) {
      return res.status(400).json({ message: 'Missing ticket fields.' });
    }

    const [result] = await pool.query(
      `INSERT INTO support_tickets (name, parish_id, subject, message, status) VALUES (?, ?, ?, ?, ?)`,
      [name, parishId, subject, message, 'Open']
    );

    res.status(201).json({ id: result.insertId, status: 'Open', message: 'Ticket submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting ticket', error: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

app.get('/api/reports/summary', async (req, res) => {
  try {
    const [userRows] = await pool.query('SELECT COUNT(*) as total FROM users');
    const totalUsers = userRows[0].total;

    const [eventStatusRows] = await pool.query('SELECT status, COUNT(*) as count FROM events GROUP BY status');

    const [eventTypeRows] = await pool.query(`
      SELECT et.name, COUNT(e.event_id) as count
      FROM event_types et
      LEFT JOIN events e ON et.event_type_id = e.event_type_id
      GROUP BY et.name
    `);

    const [scheduleRows] = await pool.query('SELECT COUNT(*) as total FROM schedules');
    const totalSchedules = scheduleRows[0].total;

    res.json({
      totalUsers,
      eventStatus: eventStatusRows,
      eventType: eventTypeRows,
      totalSchedules
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report summary', error: error.message });
  }
});

// Announcements API endpoints
app.get('/api/announcements', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO announcements (title, message, type) VALUES (?, ?, ?)',
      [title, message, type || 'general']
    );

    res.status(201).json({ id: result.insertId, title, message, type: type || 'general' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
});

app.put('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, is_active } = req.body;

    const [result] = await pool.query(
      'UPDATE announcements SET title = ?, message = ?, type = ?, is_active = ? WHERE id = ?',
      [title, message, type, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.json({ id, title, message, type, is_active });
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
});

app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM announcements WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});


app.listen(port, () => {
  console.log(`MassBook backend running on http://localhost:${port}`);
});
