import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Filter, Navigation, Globe, Map } from 'lucide-react';
import ScalableTournamentRegistration from './ScalableTournamentRegistration';

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
}

const EventCalendar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'local'>('tournaments');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [filterMode, setFilterMode] = useState<'location' | 'country'>('location');
  const [registrationModalTournament, setRegistrationModalTournament] = useState<any>(null);
  const [userId] = useState('user-123'); // Mock user ID

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
      description: 'Official VGC Regional Championships'
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
      description: 'European Spring Championships'
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
      description: 'Asia-Pacific Regional Championships'
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
      description: 'Local VGC tournament'
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
      description: 'Community meetup and practice session'
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
      description: 'European Regional Championships'
    }
  ]);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.log('Location permission denied:', error);
          setLocationPermission('denied');
        }
      );
    }
  }, []);

  // Calculate distance from user location
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter events based on active tab and filters
  const getFilteredEvents = () => {
    let filtered = events;

    if (filterMode === 'country') {
      if (selectedCountry !== 'all') {
        filtered = filtered.filter(event => event.country === selectedCountry);
      }
    } else if (filterMode === 'location' && userLocation) {
      filtered = filtered.filter(event => {
        if (event.coordinates) {
          const distance = calculateDistance(userLocation.lat, userLocation.lng, event.coordinates.lat, event.coordinates.lng);
          event.distance = distance;
          return distance <= 100;
        }
        return false;
      });
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered;
  };

  const handleRSVP = (eventId: string) => {
    // In a real app, this would make an API call
    console.log('RSVP for event:', eventId);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'bg-blue-100 text-blue-800';
      case 'meetup': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'tournament': return '🏆';
      case 'meetup': return '👥';
      default: return '📅';
    }
  };

  const getCountries = () => {
    const countries = [...new Set(events.map(event => event.country))];
    return countries.sort();
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${Math.round(distance)}km`;
  };

  const getRegistrationStatus = (event: Event) => {
    // Mock logic: if isRSVPed, user is a participant; if spots available, tickets available; else not playing
    if (event.isRSVPed) return 'participant';
    if (event.type === 'tournament' && event.maxAttendees && event.attendees < event.maxAttendees) return 'tickets';
    return 'not_playing';
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Event Calendar</h2>
            <p className="text-green-100">Find tournaments and events near you</p>
          </div>
          <Calendar className="h-8 w-8" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{events.filter(e => e.type === 'tournament').length}</p>
            <p className="text-sm text-green-100">Tournaments</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{events.filter(e => e.type === 'meetup').length}</p>
            <p className="text-sm text-green-100">Meetups</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{filteredEvents.length}</p>
            <p className="text-sm text-green-100">Available</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
            activeTab === 'tournaments'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Tournaments</span>
        </button>
        <button
          onClick={() => setActiveTab('local')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
            activeTab === 'local'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Map className="h-4 w-4" />
          <span>Local Events</span>
        </button>
      </div>

      {/* Local Events Filters */}
      {activeTab === 'local' && (
        <div className="space-y-4">
          {/* Location Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Location Services</span>
            </div>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${userLocation ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => {
                if (userLocation) {
                  setUserLocation(null);
                  setLocationPermission('denied');
                } else {
                  setLocationPermission('pending');
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setUserLocation({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        });
                        setLocationPermission('granted');
                      },
                      (error) => {
                        setLocationPermission('denied');
                      }
                    );
                  }
                }
              }}
            >
              {userLocation ? 'Disable Location' : 'Enable Location'}
            </button>
          </div>

          {/* Location Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Location</span>
            </div>
            <div className="flex items-center space-x-2">
              {userLocation && locationPermission === 'granted' ? (
                <span className="text-sm text-green-600">✓ Location enabled</span>
              ) : locationPermission === 'denied' ? (
                <span className="text-sm text-red-600">✗ Location disabled</span>
              ) : (
                <span className="text-sm text-yellow-600">⏳ Location not enabled</span>
              )}
            </div>
          </div>

          {/* Filter Mode Selection */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Filter Events</span>
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-full text-sm transition-all ${filterMode === 'location' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                onClick={() => setFilterMode('location')}
                disabled={!userLocation}
              >
                Near Me
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm transition-all ${filterMode === 'country' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                onClick={() => setFilterMode('country')}
              >
                By Country
              </button>
            </div>
          </div>
          {filterMode === 'country' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
              >
                <option value="all">All Countries</option>
                {[...new Set(events.map(e => e.country))].map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const regStatus = getRegistrationStatus(event);
          return (
            <div key={event.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                    <h3 className="font-semibold text-gray-900 text-wrap">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <span>{event.time}</span>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-wrap">{event.location}</span>
                    </div>
                    {event.distance && (
                      <>
                        <div className="hidden sm:block">•</div>
                        <span className="text-green-600 font-medium">{formatDistance(event.distance)} away</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Registration Status Button */}
                {event.type === 'tournament' && (
                  <div className="flex-shrink-0">
                    {regStatus === 'participant' ? (
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 cursor-default min-h-[44px] flex items-center justify-center">Participant</span>
                    ) : regStatus === 'tickets' ? (
                      <button
                        onClick={() => setRegistrationModalTournament(event)}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Tickets Available
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-500 cursor-default min-h-[44px] flex items-center justify-center">Not Playing</span>
                    )}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{event.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attendees
                    </span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{event.country}</span>
                </div>
                {event.maxAttendees && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.attendees >= event.maxAttendees
                      ? 'bg-red-100 text-red-800'
                      : event.attendees >= event.maxAttendees * 0.8
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {event.attendees >= event.maxAttendees ? 'Full' : 
                     event.attendees >= event.maxAttendees * 0.8 ? 'Almost Full' : 'Spots Available'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {activeTab === 'tournaments' 
              ? 'No tournaments scheduled for this period.' 
              : 'No local events found. Try adjusting your filters or location settings.'}
          </p>
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