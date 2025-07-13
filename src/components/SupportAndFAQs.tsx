import React, { useState } from 'react';
import { HelpCircle, MessageSquare, AlertTriangle, FileText, Send, ChevronDown, ChevronUp, Mail, Phone, Clock, CheckCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'tournaments' | 'technical' | 'rules' | 'registration';
}

interface ReportCase {
  id: string;
  type: 'bug' | 'rule_violation' | 'tournament_issue' | 'technical_problem' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  submittedAt: string;
  updatedAt: string;
}

const SupportAndFAQs: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'faqs' | 'support' | 'report'>('faqs');
  const [selectedFAQCategory, setSelectedFAQCategory] = useState<'all' | 'general' | 'tournaments' | 'technical' | 'rules' | 'registration'>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: 'bug' as ReportCase['type'],
    title: '',
    description: '',
    priority: 'medium' as ReportCase['priority'],
    contactEmail: '',
    tournamentId: '',
    playerId: ''
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I register for a tournament?',
      answer: 'Navigate to the Tournaments tab, find an event you want to join, and click "Register". Make sure you meet the division requirements and have your Play! Pokémon ID ready.',
      category: 'registration'
    },
    {
      id: '2',
      question: 'What happens if I need to drop from a tournament?',
      answer: 'You can drop from a tournament before it starts by going to your profile and clicking "Drop from Tournament". During live tournaments, contact a tournament official immediately.',
      category: 'tournaments'
    },
    {
      id: '3',
      question: 'How do I check my pairings?',
      answer: 'Go to the Pairings tab during a live tournament. Your current round and table will be displayed. You can also view pairings for completed tournaments in your profile history.',
      category: 'tournaments'
    },
    {
      id: '4',
      question: 'What if I encounter a technical issue during registration?',
      answer: 'If you experience technical problems, try refreshing the page first. If the issue persists, submit a report through the Support section with details about the error.',
      category: 'technical'
    },
    {
      id: '5',
      question: 'How do I report a rule violation?',
      answer: 'Use the "Submit Report" section to report rule violations. Include specific details, timestamps, and any evidence you may have. All reports are reviewed by tournament officials.',
      category: 'rules'
    },
    {
      id: '6',
      question: 'Can I change my team after registering?',
      answer: 'Team changes are typically allowed until the tournament starts. Check the specific tournament rules for deadlines and restrictions.',
      category: 'tournaments'
    },
    {
      id: '7',
      question: 'What should I do if my QR code isn\'t working?',
      answer: 'Try regenerating your QR code from the QR Code tab. If the problem continues, contact tournament staff for assistance.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'How do I follow other players?',
      answer: 'Use the Search tab to find players, or click on player names in the Following feed. Click the "Follow" button on their profile to start following them.',
      category: 'general'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: HelpCircle },
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'tournaments', label: 'Tournaments', icon: FileText },
    { id: 'technical', label: 'Technical', icon: AlertTriangle },
    { id: 'rules', label: 'Rules', icon: FileText },
    { id: 'registration', label: 'Registration', icon: CheckCircle }
  ];

  const filteredFAQs = selectedFAQCategory === 'all' ? faqs : faqs.filter(faq => faq.category === selectedFAQCategory);

  const handleSubmitReport = () => {
    // In a real app, this would submit to the backend
    console.log('Submitting report:', reportForm);
    setShowReportForm(false);
    setReportForm({
      type: 'bug',
      title: '',
      description: '',
      priority: 'medium',
      contactEmail: '',
      tournamentId: '',
      playerId: ''
    });
    // Show success message
    alert('Report submitted successfully. We will review and respond within 24-48 hours.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <HelpCircle className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Support & FAQs</h2>
            <p className="text-blue-100">Get help and find answers to common questions</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('faqs')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'faqs'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <HelpCircle className="h-4 w-4 inline mr-2" />
          FAQs
        </button>
        <button
          onClick={() => setActiveCategory('support')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'support'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Contact Support
        </button>
        <button
          onClick={() => setActiveCategory('report')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'report'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          Submit Report
        </button>
      </div>

      {/* FAQs Section */}
      {activeCategory === 'faqs' && (
        <div className="space-y-4">
          {/* Category Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedFAQCategory(category.id as any)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedFAQCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4 inline mr-2" />
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support Section */}
      {activeCategory === 'support' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">support@vgchub.com</p>
                  <p className="text-xs text-gray-500">Response within 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-500">Available during tournament hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Support Hours</p>
                  <p className="text-sm text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
                  <p className="text-xs text-gray-500">Extended hours during major tournaments</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Before Contacting Support</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Check the FAQs above for common solutions</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Try refreshing the page or clearing your browser cache</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Have your Play! Pokémon ID and tournament details ready</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Include screenshots or error messages if reporting technical issues</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Submit Report Section */}
      {activeCategory === 'report' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit a Report or Case</h3>
            <p className="text-gray-600 mb-4">
              Use this form to report bugs, rule violations, tournament issues, or other problems. 
              All reports are reviewed by our support team.
            </p>
            
            <button
              onClick={() => setShowReportForm(true)}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Submit New Report</span>
            </button>
          </div>

          {/* Report Form Modal */}
          {showReportForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Submit Report</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select
                      value={reportForm.type}
                      onChange={(e) => setReportForm({ ...reportForm, type: e.target.value as ReportCase['type'] })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="bug">Technical Bug</option>
                      <option value="rule_violation">Rule Violation</option>
                      <option value="tournament_issue">Tournament Issue</option>
                      <option value="technical_problem">Technical Problem</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={reportForm.priority}
                      onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value as ReportCase['priority'] })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={reportForm.title}
                      onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      placeholder="Detailed description of the issue..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={reportForm.contactEmail}
                      onChange={(e) => setReportForm({ ...reportForm, contactEmail: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tournament ID (if applicable)</label>
                    <input
                      type="text"
                      value={reportForm.tournamentId}
                      onChange={(e) => setReportForm({ ...reportForm, tournamentId: e.target.value })}
                      placeholder="Optional"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Player ID (if applicable)</label>
                    <input
                      type="text"
                      value={reportForm.playerId}
                      onChange={(e) => setReportForm({ ...reportForm, playerId: e.target.value })}
                      placeholder="Optional"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowReportForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={!reportForm.title || !reportForm.description || !reportForm.contactEmail}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportAndFAQs; 