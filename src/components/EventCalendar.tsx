import React, { useState, useMemo } from 'react';
import { Calendar as LucideCalendar, MapPin, Users, Filter, Navigation, Globe, Map } from 'lucide-react';
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

  // Mock events data
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Phoenix Regional Championships',
      type: 'tournament',
      date: '2024-03-15',
      time: '09:00 AM',
      location: 'Phoenix Convention Center',
      country: 'United States',
      coordinates: { lat: 33.4484, lng: -112.0740 },
      attendees: 256,
      maxAttendees: 300,
      isRSVPed: true,
      description: 'Official VGC Regional Championships',
      ownerId: 'user-123',
    },
    {
      id: '2',
      title: 'London Spring Championships',
      type: 'tournament',
      date: '2024-03-22',
      time: '10:00 AM',
      location: 'ExCeL London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: 0.0000 },
      attendees: 180,
      maxAttendees: 250,
      isRSVPed: false,
      description: 'European Spring Championships',
      ownerId: 'user-456',
    },
    {
      id: '3',
      title: 'Tokyo Regional Championships',
      type: 'tournament',
      date: '2024-03-29',
      time: '09:30 AM',
      location: 'Tokyo Game Show',
      country: 'Japan',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      attendees: 320,
      maxAttendees: 400,
      isRSVPed: false,
      description: 'Asia-Pacific Regional Championships',
      ownerId: 'user-789',
    },
    {
      id: '4',
      title: 'Sydney Local Tournament',
      type: 'tournament',
      date: '2024-03-16',
      time: '02:00 PM',
      location: 'Sydney Gaming Center',
      country: 'Australia',
      coordinates: { lat: -33.8688, lng: 151.2093 },
      attendees: 45,
      maxAttendees: 64,
      isRSVPed: false,
      description: 'Local VGC tournament',
      ownerId: 'user-456',
    },
    {
      id: '5',
      title: 'Toronto Community Meetup',
      type: 'meetup',
      date: '2024-03-20',
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
      date: '2024-04-05',
      time: '09:00 AM',
      location: 'Messe Berlin',
      country: 'Germany',
      coordinates: { lat: 52.5200, lng: 13.4050 },
      attendees: 200,
      maxAttendees: 300,
      isRSVPed: false,
      description: 'European Regional Championships',
      ownerId: 'user-456',
    }
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

  return (
    <div className="px-4 py-6 space-y-6">
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
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          popup
          onSelectEvent={event => setSelectedEvent(event.resource)}
          eventPropGetter={event => {
            let backgroundColor = event.type === 'tournament' ? '#2563eb' : '#22c55e';
            return { style: { backgroundColor, color: 'white', borderRadius: 8, border: 'none', fontWeight: 500 } };
          }}
        />
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
            {/* RSVP/Join Button (prevent following yourself) */}
            {selectedEvent.type === 'tournament' && canRSVP(selectedEvent) && (
              <button
                onClick={() => setRegistrationModalTournament(selectedEvent)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
              >
                {selectedEvent.isRSVPed ? 'Registered' : 'Tickets Available'}
              </button>
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