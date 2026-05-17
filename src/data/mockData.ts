export const appointmentCards = [
  {
    title: 'Wedding Ceremony',
    date: 'Oct 24, 2024',
    time: '02:00 PM',
    location: "Saint Mary's Cathedral",
    status: 'Approved',
  },
  {
    title: 'Infant Baptism',
    date: 'Nov 12, 2024',
    time: '10:30 AM',
    location: 'Parish Hall',
    status: 'Pending',
  },
  {
    title: 'Confirmation Session',
    date: 'Nov 20, 2024',
    time: '02:30 PM',
    location: 'Parish Center',
    status: 'Confirmed',
  },
  {
    title: 'Funeral Service',
    date: 'Dec 02, 2024',
    time: '11:00 AM',
    location: 'Chapel of St. Joseph',
    status: 'Approved',
  },
  {
    title: 'Reconciliation',
    date: 'Oct 28, 2024',
    time: '04:30 PM',
    location: 'Confessional',
    status: 'Confirmed',
  },
];

export const pendingRequests = [
  {
    id: 'WM-4592',
    type: 'Wedding',
    name: 'Elena & Marcus Thorne',
    requested: 'Oct 24, 2024',
    submitted: 'Aug 12, 2024',
    status: 'Pending',
  },
  {
    id: 'BA-2285',
    type: 'Baptism',
    name: 'Sarah Jennings (Infant Leo)',
    requested: 'Sep 15, 2024',
    submitted: 'Aug 14, 2024',
    status: 'Pending',
  },
  {
    id: 'CF-9911',
    type: 'Confirmation',
    name: 'David Miller',
    requested: 'Nov 02, 2024',
    submitted: 'Aug 15, 2024',
    status: 'Pending',
  },
  {
    id: 'FU-7330',
    type: 'Funeral',
    name: 'Estate of Robert Chen',
    requested: 'Aug 22, 2024',
    submitted: 'Aug 16, 2024',
    status: 'Pending',
  },
];

export const requestDetails = [
  {
    id: 'WM-4592',
    title: 'Wedding Mass',
    massType: 'Nuptial Mass (Wedding)',
    status: 'Pending Review',
    eventTitle: 'Event Request #WM-4592',
    preferredCelebrant: 'Fr. Thomas Aquinas',
    location: "Main Sanctuary - St. Mary's Cathedral",
    proposedDate: 'Saturday, October 12, 2024',
    proposedTime: '10:00 AM - 12:00 PM',
    expectedGuests: '150 Guests',
    notes: 'The couple requests use of the grand organ for the entrance procession. We would also like to reserve the parish hall for a small post-ceremony greeting (approx 30 mins).',
    primaryContact: {
      name: 'Mark Benedict Henderson',
      role: 'Primary Contact (Groom)',
      email: 'm.henderson@example.com',
      phone: '(555) 123-4567',
      tag: 'Registered Member',
    },
    secondaryContact: {
      name: 'Elena Rose Marie',
      role: 'Co-Contact (Bride)',
      email: 'elena.rose@example.com',
      phone: '(555) 987-6543',
      tag: 'Registered Member',
    },
    documents: [
      {
        label: 'Baptismal Certificate - Groom',
        fileType: 'PDF',
        size: '1.2 MB',
        uploaded: 'Uploaded Sep 12',
        status: 'view',
      },
      {
        label: 'Baptismal Certificate - Bride',
        fileType: 'PDF',
        size: '1.4 MB',
        uploaded: 'Uploaded Sep 12',
        status: 'view',
      },
      {
        label: 'Pre-Cana Completion Certificate',
        fileType: 'PDF',
        size: '0.8 MB',
        uploaded: 'Uploaded Sep 23',
        status: 'view',
      },
      {
        label: 'Civil Marriage License',
        fileType: 'PDF',
        size: 'Missing',
        uploaded: 'Required before final approval',
        status: 'missing',
      },
    ],
    history: [
      {
        title: 'Request Created',
        summary: 'Submitted by Mark Benedict Henderson.',
        timestamp: 'Sep 02, 2024 • 10:28 AM',
      },
      {
        title: 'Documents Updated',
        summary: 'Pre-Cana certificate added by parishioner.',
        timestamp: 'Sep 23, 2024 • 11:12 AM',
      },
      {
        title: 'Assigned to Admin Review',
        summary: 'Request moved into the pending review queue.',
        timestamp: 'Oct 02, 2024 • 09:00 AM',
      },
      {
        title: 'Status Changed to Pending Review',
        summary: 'Awaiting final approval from the parish office.',
        timestamp: 'Today • 09:00 AM',
      },
    ],
  },
];

export const scheduleSlots = [
  { day: 'Mon', time: '07:00 AM', title: 'Daily Mass' },
  { day: 'Tue', time: '07:00 AM', title: 'Daily Mass' },
  { day: 'Wed', time: '07:00 AM', title: 'Daily Mass' },
  { day: 'Thu', time: '07:00 AM', title: 'Daily Mass' },
  { day: 'Fri', time: '07:00 AM', title: 'Daily Mass' },
  { day: 'Sat', time: '08:30 AM', title: 'Daily Mass' },
  { day: 'Sun', time: '08:00 AM', title: 'Sunday Mass' },
];
