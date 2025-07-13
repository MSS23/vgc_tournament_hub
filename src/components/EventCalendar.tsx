import React, { useState, useMemo, useRef } from 'react';
import { Calendar as LucideCalendar, MapPin, Users, Filter, Navigation, Globe, Map, Plus, ExternalLink } from 'lucide-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ScalableTournamentRegistration from './ScalableTournamentRegistration';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  type: 'tournament' | 'meetup';
  date: string;
  time: string;
  location: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  attendees: number;
  maxAttendees?: number;
  isRSVPed: boolean;
  description: string;
  distance?: number; // Distance from user location in km
  ownerId?: string; // Add ownerId to prevent following yourself
}

const userId = 'user-123'; // Mock user ID

const EventCalendar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'local'>('tournaments');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'location' | 'country'>('location');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [registrationModalTournament, setRegistrationModalTournament] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef<any>(null);

  // Mock events data
  const [events] = useState<Event[]>([
    // Current month tournaments
    {
      id: '1',
      title: 'Phoenix Regional Championships',
      type: 'tournament',
      date: '2024-12-15',
      time: '09:00 AM',
      location: 'Phoenix Convention Center',
      country: 'United States',
      coordinates: { lat: 33.4484, lng: -112.0740 },
      attendees: 256,
      maxAttendees: 300,
      isRSVPed: true,
      description: 'Official VGC Regional Championships - Regulation H',
      ownerId: 'user-123',
    },
    {
      id: '2',
      title: 'London Spring Championships',
      type: 'tournament',
      date: '2024-12-22',
      time: '10:00 AM',
      location: 'ExCeL London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: 0.0000 },
      attendees: 180,
      maxAttendees: 250,
      isRSVPed: false,
      description: 'European Spring Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '3',
      title: 'Tokyo Regional Championships',
      type: 'tournament',
      date: '2024-12-29',
      time: '09:30 AM',
      location: 'Tokyo Game Show',
      country: 'Japan',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      attendees: 320,
      maxAttendees: 400,
      isRSVPed: false,
      description: 'Asia-Pacific Regional Championships - Regulation H',
      ownerId: 'user-789',
    },
    {
      id: '4',
      title: 'Sydney Local Tournament',
      type: 'tournament',
      date: '2024-12-16',
      time: '02:00 PM',
      location: 'Sydney Gaming Center',
      country: 'Australia',
      coordinates: { lat: -33.8688, lng: 151.2093 },
      attendees: 45,
      maxAttendees: 64,
      isRSVPed: false,
      description: 'Local VGC tournament - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '5',
      title: 'Toronto Community Meetup',
      type: 'meetup',
      date: '2024-12-20',
      time: '06:00 PM',
      location: 'Toronto Gaming Hub',
      country: 'Canada',
      coordinates: { lat: 43.6532, lng: -79.3832 },
      attendees: 25,
      maxAttendees: 50,
      isRSVPed: false,
      description: 'Community meetup and practice session',
      ownerId: 'user-456',
    },
    {
      id: '6',
      title: 'Berlin Regional Championships',
      type: 'tournament',
      date: '2025-01-05',
      time: '09:00 AM',
      location: 'Messe Berlin',
      country: 'Germany',
      coordinates: { lat: 52.5200, lng: 13.4050 },
      attendees: 200,
      maxAttendees: 300,
      isRSVPed: false,
      description: 'European Regional Championships - Regulation H',
      ownerId: 'user-456',
    },
    // January 2025 tournaments
    {
      id: '7',
      title: 'New York Winter Championships',
      type: 'tournament',
      date: '2025-01-12',
      time: '08:30 AM',
      location: 'Javits Center',
      country: 'United States',
      coordinates: { lat: 40.7589, lng: -74.0000 },
      attendees: 450,
      maxAttendees: 512,
      isRSVPed: false,
      description: 'Major Winter Championships - Regulation H',
      ownerId: 'user-789',
    },
    {
      id: '8',
      title: 'Paris Regional Championships',
      type: 'tournament',
      date: '2025-01-19',
      time: '09:00 AM',
      location: 'Paris Expo Porte de Versailles',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      attendees: 280,
      maxAttendees: 350,
      isRSVPed: false,
      description: 'French Regional Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '9',
      title: 'Seoul Regional Championships',
      type: 'tournament',
      date: '2025-01-26',
      time: '10:00 AM',
      location: 'COEX Convention Center',
      country: 'South Korea',
      coordinates: { lat: 37.5665, lng: 126.9780 },
      attendees: 320,
      maxAttendees: 400,
      isRSVPed: false,
      description: 'Korean Regional Championships - Regulation H',
      ownerId: 'user-789',
    },
    // February 2025 tournaments
    {
      id: '10',
      title: 'Los Angeles Regional Championships',
      type: 'tournament',
      date: '2025-02-02',
      time: '09:00 AM',
      location: 'Los Angeles Convention Center',
      country: 'United States',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      attendees: 380,
      maxAttendees: 450,
      isRSVPed: false,
      description: 'West Coast Regional Championships - Regulation H',
      ownerId: 'user-123',
    },
    {
      id: '11',
      title: 'Milan Regional Championships',
      type: 'tournament',
      date: '2025-02-09',
      time: '09:30 AM',
      location: 'Fiera Milano',
      country: 'Italy',
      coordinates: { lat: 45.4642, lng: 9.1900 },
      attendees: 220,
      maxAttendees: 280,
      isRSVPed: false,
      description: 'Italian Regional Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '12',
      title: 'Singapore Regional Championships',
      type: 'tournament',
      date: '2025-02-16',
      time: '09:00 AM',
      location: 'Marina Bay Sands',
      country: 'Singapore',
      coordinates: { lat: 1.3521, lng: 103.8198 },
      attendees: 180,
      maxAttendees: 250,
      isRSVPed: false,
      description: 'Southeast Asia Regional Championships - Regulation H',
      ownerId: 'user-789',
    },
    // March 2025 tournaments
    {
      id: '13',
      title: 'Chicago Regional Championships',
      type: 'tournament',
      date: '2025-03-02',
      time: '08:00 AM',
      location: 'McCormick Place',
      country: 'United States',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      attendees: 420,
      maxAttendees: 500,
      isRSVPed: false,
      description: 'Midwest Regional Championships - Regulation H',
      ownerId: 'user-123',
    },
    {
      id: '14',
      title: 'Madrid Regional Championships',
      type: 'tournament',
      date: '2025-03-09',
      time: '09:00 AM',
      location: 'IFEMA Madrid',
      country: 'Spain',
      coordinates: { lat: 40.4168, lng: -3.7038 },
      attendees: 240,
      maxAttendees: 300,
      isRSVPed: false,
      description: 'Spanish Regional Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '15',
      title: 'Melbourne Regional Championships',
      type: 'tournament',
      date: '2025-03-16',
      time: '09:30 AM',
      location: 'Melbourne Convention Centre',
      country: 'Australia',
      coordinates: { lat: -37.8136, lng: 144.9631 },
      attendees: 160,
      maxAttendees: 200,
      isRSVPed: false,
      description: 'Australian Regional Championships - Regulation H',
      ownerId: 'user-789',
    },
    // April 2025 tournaments
    {
      id: '16',
      title: 'Vancouver Regional Championships',
      type: 'tournament',
      date: '2025-04-06',
      time: '09:00 AM',
      location: 'Vancouver Convention Centre',
      country: 'Canada',
      coordinates: { lat: 49.2827, lng: -123.1207 },
      attendees: 200,
      maxAttendees: 256,
      isRSVPed: false,
      description: 'Canadian Regional Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '17',
      title: 'Amsterdam Regional Championships',
      type: 'tournament',
      date: '2025-04-13',
      time: '09:30 AM',
      location: 'RAI Amsterdam',
      country: 'Netherlands',
      coordinates: { lat: 52.3676, lng: 4.9041 },
      attendees: 180,
      maxAttendees: 250,
      isRSVPed: false,
      description: 'Dutch Regional Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '18',
      title: 'Hong Kong Regional Championships',
      type: 'tournament',
      date: '2025-04-20',
      time: '10:00 AM',
      location: 'Hong Kong Convention Centre',
      country: 'Hong Kong',
      coordinates: { lat: 22.3193, lng: 114.1694 },
      attendees: 220,
      maxAttendees: 280,
      isRSVPed: false,
      description: 'Hong Kong Regional Championships - Regulation H',
      ownerId: 'user-789',
    },
    // Community events
    {
      id: '19',
      title: 'VGC Strategy Workshop',
      type: 'meetup',
      date: '2024-12-28',
      time: '02:00 PM',
      location: 'Local Gaming Store',
      country: 'United States',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      attendees: 15,
      maxAttendees: 30,
      isRSVPed: false,
      description: 'Learn advanced VGC strategies and team building',
      ownerId: 'user-123',
    },
    {
      id: '20',
      title: 'Pokemon TCG & VGC Crossover Event',
      type: 'meetup',
      date: '2025-01-25',
      time: '01:00 PM',
      location: 'Community Center',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      attendees: 35,
      maxAttendees: 60,
      isRSVPed: false,
      description: 'Dual format event for Pokemon TCG and VGC players',
      ownerId: 'user-456',
    },
    {
      id: '21',
      title: 'San Diego Fall Open',
      type: 'tournament',
      date: '2025-08-15',
      time: '10:00 AM',
      location: 'San Diego Convention Center',
      country: 'United States',
      coordinates: { lat: 32.7066, lng: -117.1618 },
      attendees: 120,
      maxAttendees: 200,
      isRSVPed: false,
      description: 'Late summer VGC Open - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '22',
      title: 'Singapore Masters Invitational',
      type: 'tournament',
      date: '2025-09-10',
      time: '09:00 AM',
      location: 'Suntec Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.2931, lng: 103.8572 },
      attendees: 180,
      maxAttendees: 256,
      isRSVPed: false,
      description: 'Asia Masters Invitational - Regulation H',
      ownerId: 'user-789',
    },
    {
      id: '23',
      title: 'VGC Halloween Bash',
      type: 'meetup',
      date: '2025-10-31',
      time: '06:00 PM',
      location: 'Local Game Store',
      country: 'United States',
      coordinates: { lat: 40.7306, lng: -73.9352 },
      attendees: 40,
      maxAttendees: 60,
      isRSVPed: false,
      description: 'Costume contest, battles, and candy!',
      ownerId: 'user-123',
    },
    {
      id: '24',
      title: 'Paris Winter Championships',
      type: 'tournament',
      date: '2025-12-14',
      time: '09:00 AM',
      location: 'Paris Expo Porte de Versailles',
      country: 'France',
      coordinates: { lat: 48.8322, lng: 2.2875 },
      attendees: 210,
      maxAttendees: 300,
      isRSVPed: false,
      description: 'End-of-year VGC Championships - Regulation H',
      ownerId: 'user-456',
    },
    {
      id: '25',
      title: 'Sydney New Year Meetup',
      type: 'meetup',
      date: '2026-01-02',
      time: '05:00 PM',
      location: 'Sydney Gaming Center',
      country: 'Australia',
      coordinates: { lat: -33.8688, lng: 151.2093 },
      attendees: 30,
      maxAttendees: 50,
      isRSVPed: false,
      description: 'Kick off the new year with VGC friends!',
      ownerId: 'user-456',
    },
  ]);

  // Calendar events for react-big-calendar
  const calendarEvents = useMemo(() =>
    events.map(event => {
      const [hour, minute] = event.time.split(':');
      const ampm = event.time.toLowerCase().includes('pm');
      let hourNum = parseInt(hour, 10);
      if (ampm && hourNum < 12) hourNum += 12;
      if (!ampm && hourNum === 12) hourNum = 0;
      const start = new Date(event.date);
      start.setHours(hourNum, parseInt(minute), 0, 0);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2 hour event
      return {
        ...event,
        start,
        end,
        title: event.title,
        resource: event,
      };
    }),
    [events]
  );

  // Filter events for sidebar list
  const getFilteredEvents = () => {
    let filtered = events;
    if (filterMode === 'country') {
      if (selectedCountry !== 'all') {
        filtered = filtered.filter(event => event.country === selectedCountry);
      }
    }
    // No location filter for calendar view for simplicity
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Prevent following yourself (no RSVP/join for your own events)
  const canRSVP = (event: Event) => event.ownerId !== userId;

  // Helper to format event time in user's local timezone
  const formatLocalTime = (dateStr: string, timeStr: string) => {
    // Assume dateStr is YYYY-MM-DD and timeStr is HH:mm AM/PM
    const [year, month, day] = dateStr.split('-').map(Number);
    let [time, ampm] = timeStr.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (ampm && ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm && ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    // Create a Date object in local time (assume event is local to its location, but we treat as UTC for demo)
    const eventDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    // Format in user's local timezone
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit', minute: '2-digit', hour12: true, weekday: 'short', month: 'short', day: 'numeric', timeZoneName: 'short'
    }).format(eventDate);
  };

  // Navigate to specific event date in calendar
  const navigateToEventDate = (event: Event) => {
    const eventDate = new Date(event.date);
    setCurrentDate(eventDate);
    
    // Scroll to calendar section
    const calendarSection = document.querySelector('.rbc-calendar');
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Open event modal after a short delay
    setTimeout(() => setSelectedEvent(event), 500);
  };

  // Add to Google Calendar
  const addToGoogleCalendar = (event: Event) => {
    const [year, month, day] = event.date.split('-').map(Number);
    let [time, ampm] = event.time.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (ampm && ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm && ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    
    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', event.title);
    googleCalendarUrl.searchParams.set('dates', 
      `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}${startDate.getMinutes().toString().padStart(2, '0')}00Z` +
      '/' +
      `${endDate.getFullYear()}${(endDate.getMonth() + 1).toString().padStart(2, '0')}${endDate.getDate().toString().padStart(2, '0')}T${endDate.getHours().toString().padStart(2, '0')}${endDate.getMinutes().toString().padStart(2, '0')}00Z`
    );
    googleCalendarUrl.searchParams.set('details', event.description);
    googleCalendarUrl.searchParams.set('location', `${event.location}, ${event.country}`);
    
    window.open(googleCalendarUrl.toString(), '_blank');
  };

  // Add to Apple Calendar
  const addToAppleCalendar = (event: Event) => {
    const [year, month, day] = event.date.split('-').map(Number);
    let [time, ampm] = event.time.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (ampm && ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm && ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    
    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    // Create iCal format data
    const icalData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VGC Hub//Pokemon Tournament//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@vgchub.com`,
      `DTSTART:${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}${startDate.getMinutes().toString().padStart(2, '0')}00Z`,
      `DTEND:${endDate.getFullYear()}${(endDate.getMonth() + 1).toString().padStart(2, '0')}${endDate.getDate().toString().padStart(2, '0')}T${endDate.getHours().toString().padStart(2, '0')}${endDate.getMinutes().toString().padStart(2, '0')}00Z`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}, ${event.country}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    // Create and download .ics file
    const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 space-y-6 w-full max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Event Calendar</h2>
            <p className="text-green-100">Find tournaments and events near you</p>
          </div>
          <LucideCalendar className="h-8 w-8" />
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl p-2 sm:p-4 border border-gray-200 w-full max-w-full overflow-x-auto min-w-0">
        <div className="min-w-[700px] w-full max-w-full">
          <BigCalendar
            ref={calendarRef}
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, minWidth: 700 }}
            popup
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            onSelectEvent={event => setSelectedEvent(event.resource)}
            eventPropGetter={event => {
              let backgroundColor = event.type === 'tournament' ? '#2563eb' : '#22c55e';
              return { style: { backgroundColor, color: 'white', borderRadius: 8, border: 'none', fontWeight: 500 } };
            }}
          />
        </div>
        {/* Horizontal scroll hint for mobile */}
        <div className="block sm:hidden text-xs text-gray-400 text-center mt-2">↔️ Scroll to see more dates</div>
      </div>

      {/* Event List with View Details button and filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          {/* Local/Regional Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterMode === 'local' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilterMode('local')}
            >
              Local
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterMode === 'country' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setFilterMode('country')}
            >
              Regional
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {filteredEvents
            .filter(event => filterMode === 'local' ? event.type === 'meetup' : event.type === 'tournament')
            .map(event => (
            <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-2 mt-1">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{event.time}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                  <span>•</span>
                  <span>{event.country}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{event.description}</div>
              </div>
              <div className="mt-3 md:mt-0 flex flex-col items-end gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={() => setSelectedEvent(event)}
                >
                  View Details
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  onClick={() => navigateToEventDate(event)}
                >
                  View on Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{selectedEvent.type === 'tournament' ? '🏆' : '👥'}</span>
              <h3 className="font-semibold text-gray-900 text-lg">{selectedEvent.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedEvent.type === 'tournament' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <LucideCalendar className="h-4 w-4" />
                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="hidden sm:block">•</div>
              <span>{selectedEvent.time}</span>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="text-wrap">{selectedEvent.location}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">{selectedEvent.description}</p>
            {/* Google Maps Embed */}
            {selectedEvent.coordinates && (
              <div className="mb-4">
                <iframe
                  title="Venue Map"
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: '12px' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${selectedEvent.coordinates.lat},${selectedEvent.coordinates.lng}&hl=en&z=15&output=embed`}
                ></iframe>
              </div>
            )}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {selectedEvent.attendees}{selectedEvent.maxAttendees ? `/${selectedEvent.maxAttendees}` : ''} attendees
                </span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{selectedEvent.country}</span>
            </div>
            {selectedEvent.maxAttendees && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                selectedEvent.attendees >= selectedEvent.maxAttendees
                  ? 'bg-red-100 text-red-800'
                  : selectedEvent.attendees >= selectedEvent.maxAttendees * 0.8
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedEvent.attendees >= selectedEvent.maxAttendees ? 'Full' : 
                 selectedEvent.attendees >= selectedEvent.maxAttendees * 0.8 ? 'Almost Full' : 'Spots Available'}
              </div>
            )}
            {/* Calendar Integration Buttons */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <LucideCalendar className="h-5 w-5 text-blue-600" />
                Add to Calendar
              </h4>
              <div className="flex space-x-2 mb-1">
                <button
                  onClick={() => addToGoogleCalendar(selectedEvent)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  aria-label="Add to Google Calendar"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Google Calendar</span>
                </button>
                <button
                  onClick={() => addToAppleCalendar(selectedEvent)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                  aria-label="Add to Apple Calendar"
                >
                  <Plus className="h-4 w-4" />
                  <span>Apple Calendar</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">Currently only Google and Apple Calendar are supported.</p>
            </div>

            {/* RSVP/Join Button (prevent following yourself) */}
            {selectedEvent.type === 'tournament' && canRSVP(selectedEvent) && (
              selectedEvent.attendees < selectedEvent.maxAttendees ? (
                selectedEvent.isRSVPed ? (
                  <button
                    className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium mt-2 cursor-not-allowed"
                    disabled
                  >
                    Registered
                  </button>
                ) : (
                  <button
                    onClick={() => setRegistrationModalTournament(selectedEvent)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
                  >
                    Register Now
                  </button>
                )
              ) : (
                <button
                  onClick={() => setRegistrationModalTournament(selectedEvent)}
                  className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mt-2"
                >
                  Join Waitlist
                </button>
              )
            )}
            {selectedEvent.type === 'tournament' && !canRSVP(selectedEvent) && (
              <span className="w-full block text-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium mt-2 cursor-default">You are the organizer</span>
            )}
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {registrationModalTournament && (
        <ScalableTournamentRegistration
          tournament={{
            id: registrationModalTournament.id,
            name: registrationModalTournament.title,
            date: registrationModalTournament.date,
            location: registrationModalTournament.location,
            totalPlayers: registrationModalTournament.attendees,
            status: 'registration',
            maxCapacity: registrationModalTournament.maxAttendees || 256,
            currentRegistrations: registrationModalTournament.attendees,
            waitlistEnabled: true,
            waitlistCapacity: 100,
            currentWaitlist: 0,
            registrationType: 'first-come-first-served',
          }}
          userDivision={'master'}
          onRegister={() => setRegistrationModalTournament(null)}
        />
      )}
    </div>
  );
};

export default EventCalendar;