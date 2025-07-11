import React, { useState } from 'react';
import { Plus, Save, Send, Calendar, MapPin, Users, Award, FileText, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { TournamentCreationRequest } from '../types';

interface TournamentCreationProps {
  isProfessor: boolean;
  professorLevel?: string;
  certificationNumber?: string;
  onRequestSubmit: (request: TournamentCreationRequest) => void;
}

const TournamentCreation: React.FC<TournamentCreationProps> = ({
  isProfessor,
  professorLevel,
  certificationNumber,
  onRequestSubmit
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'drafts' | 'pending' | 'approved'>('create');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    maxCapacity: 64,
    format: 'VGC 2024 Regulation H',
    rules: '',
    prizes: '',
    venueDetails: '',
    contactInfo: '',
    specialRequirements: [] as string[]
  });
  const [newRequirement, setNewRequirement] = useState('');

  // Mock data for existing requests
  const [requests] = useState<TournamentCreationRequest[]>([
    {
      id: 'req-1',
      professorId: '1',
      professorName: 'Alex Rodriguez',
      professorLevel: 'full',
      certificationNumber: 'PROF-2023-001',
      tournamentData: {
        name: 'Phoenix Regional Championships 2024',
        date: '2024-03-15',
        location: 'Phoenix Convention Center, AZ',
        maxCapacity: 700,
        format: 'VGC 2024 Regulation H',
        rules: 'Standard VGC rules with Regulation H restrictions',
        prizes: 'Championship Points, TCG Booster Packs, Trophy',
        venueDetails: 'Phoenix Convention Center, Hall A. Parking available on-site.',
        contactInfo: 'alex.rodriguez@vgc-hub.com',
        specialRequirements: ['Age verification required', 'Guardian consent for minors']
      },
      status: 'approved',
      submittedAt: '2024-01-15T10:00:00Z',
      reviewedAt: '2024-01-20T14:30:00Z',
      reviewedBy: 'pokemon-company-admin',
      reviewerRole: 'Tournament Coordinator',
      comments: 'Approved with minor venue capacity adjustments',
      requiresPokemonCompanyApproval: true,
      pokemonCompanyStatus: 'approved',
      pokemonCompanyReviewer: {
        id: 'pkmn-admin-1',
        name: 'Jennifer Smith',
        role: 'Senior Tournament Coordinator'
      },
      pokemonCompanyComments: 'Tournament meets all requirements. Venue capacity confirmed.'
    },
    {
      id: 'req-2',
      professorId: '2',
      professorName: 'Sarah Chen',
      professorLevel: 'associate',
      certificationNumber: 'PROF-2023-045',
      tournamentData: {
        name: 'Seattle Spring Championships 2024',
        date: '2024-04-20',
        location: 'Seattle Convention Center, WA',
        maxCapacity: 500,
        format: 'VGC 2024 Regulation H',
        rules: 'Standard VGC rules with Regulation H restrictions',
        prizes: 'Championship Points, TCG Booster Packs, Trophy',
        venueDetails: 'Seattle Convention Center, Main Hall. Accessible venue with parking.',
        contactInfo: 'sarah.chen@vgc-hub.com',
        specialRequirements: ['Age verification required']
      },
      status: 'pending',
      submittedAt: '2024-03-18T16:00:00Z',
      requiresPokemonCompanyApproval: true,
      pokemonCompanyStatus: 'pending'
    }
  ]);

  if (!isProfessor) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Professor Access Required</h3>
          <p className="text-gray-600">
            Only certified Pokémon Professors can create tournaments. Please contact the Pokémon Company to apply for professor certification.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.date || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    const request: TournamentCreationRequest = {
      id: `req-${Date.now()}`,
      professorId: '1', // In real app, this would be the current user's ID
      professorName: 'Alex Rodriguez', // In real app, this would be the current user's name
      professorLevel: professorLevel || 'full',
      certificationNumber: certificationNumber || 'PROF-2023-001',
      tournamentData: formData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      requiresPokemonCompanyApproval: formData.maxCapacity > 100
    };

    onRequestSubmit(request);
    setShowForm(false);
    setFormData({
      name: '',
      date: '',
      location: '',
      maxCapacity: 64,
      format: 'VGC 2024 Regulation H',
      rules: '',
      prizes: '',
      venueDetails: '',
      contactInfo: '',
      specialRequirements: []
    });
  };

  const handleSaveDraft = () => {
    const request: TournamentCreationRequest = {
      id: `req-${Date.now()}`,
      professorId: '1',
      professorName: 'Alex Rodriguez',
      professorLevel: professorLevel || 'full',
      certificationNumber: certificationNumber || 'PROF-2023-001',
      tournamentData: formData,
      status: 'draft',
      submittedAt: new Date().toISOString(),
      requiresPokemonCompanyApproval: formData.maxCapacity > 100
    };

    onRequestSubmit(request);
    setShowForm(false);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        specialRequirements: [...prev.specialRequirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredRequests = requests.filter(req => {
    switch (activeTab) {
      case 'drafts': return req.status === 'draft';
      case 'pending': return req.status === 'pending';
      case 'approved': return req.status === 'approved';
      default: return true;
    }
  });

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Tournament Creation</h2>
            <p className="text-purple-100">Create and manage tournament requests</p>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6" />
            <span className="text-sm">Professor {professorLevel}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'draft').length}</p>
            <p className="text-sm text-purple-100">Drafts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm text-purple-100">Pending Review</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
            <p className="text-sm text-purple-100">Approved</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'rejected').length}</p>
            <p className="text-sm text-purple-100">Rejected</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-full transition-all ${
            activeTab === 'create'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Create New
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-full transition-all ${
            activeTab === 'drafts'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Drafts
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-full transition-all ${
            activeTab === 'pending'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-full transition-all ${
            activeTab === 'approved'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Approved
        </button>
      </div>

      {/* Create New Tournament Form */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {!showForm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Tournament</h3>
              <p className="text-gray-600 mb-6">
                Fill out the tournament details below. Large tournaments (100+ players) require Pokémon Company approval.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Creating Tournament
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tournament Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Phoenix Regional Championships 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Phoenix Convention Center, AZ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 64 }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="8"
                    max="1000"
                  />
                  {formData.maxCapacity > 100 && (
                    <p className="text-sm text-yellow-600 mt-1">
                      ⚠️ Tournaments with 100+ players require Pokémon Company approval
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="VGC 2024 Regulation H">VGC 2024 Regulation H</option>
                    <option value="VGC 2024 Regulation G">VGC 2024 Regulation G</option>
                    <option value="VGC 2023 Regulation F">VGC 2023 Regulation F</option>
                    <option value="Custom Format">Custom Format</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament Rules
                </label>
                <textarea
                  value={formData.rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the tournament rules, format, and any special requirements..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prizes
                </label>
                <textarea
                  value={formData.prizes}
                  onChange={(e) => setFormData(prev => ({ ...prev, prizes: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the prizes for winners..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Details
                </label>
                <textarea
                  value={formData.venueDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, venueDetails: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe venue details, parking, accessibility..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Age verification required"
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <button
                    onClick={addRequirement}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialRequirements.map((req, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      <span>{req}</span>
                      <button
                        onClick={() => removeRequirement(index)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.date || !formData.location}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit for Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Request List */}
      {activeTab !== 'create' && (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{request.tournamentData.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.tournamentData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{request.tournamentData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{request.tournamentData.maxCapacity} players</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              {request.comments && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{request.comments}</p>
                </div>
              )}

              {request.pokemonCompanyStatus && (
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Pokémon Company Review: {request.pokemonCompanyStatus.charAt(0).toUpperCase() + request.pokemonCompanyStatus.slice(1)}
                  </p>
                  {request.pokemonCompanyComments && (
                    <p className="text-sm text-blue-700">{request.pokemonCompanyComments}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                {request.reviewedAt && (
                  <span>Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {activeTab === 'drafts' ? 'You haven\'t created any drafts yet.' :
                 activeTab === 'pending' ? 'No requests are pending review.' :
                 'No requests have been approved yet.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentCreation; 