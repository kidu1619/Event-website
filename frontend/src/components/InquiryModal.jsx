import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';
import { 
  X, 
  Send, 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

export default function InquiryModal({
  vendor,
  onClose,
  onSuccess
}) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventType, setEventType] = useState('Modern Wedding');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('Addis Ababa (Skylight / Sheraton / Grand Palace)');
  const [guestCount, setGuestCount] = useState('300 - 500 Guests');
  const [budgetRange, setBudgetRange] = useState('150,000 - 250,000 ETB');
  const [message, setMessage] = useState('');
  const [selectedServices, setSelectedServices] = useState(['Full Event Scenography']);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vendor) return null;

  const servicesOptions = vendor.category === 'Decor' 
    ? ['Grand Stage Scenography', 'Floral Archways & Runners', 'Ceiling Drapes & Chandeliers', 'Traditional Melse Setup', 'Table Escapes & Centerpieces']
    : ['4K Multi-Camera Cinema', 'Drone Aerial Coverage', 'Same-Day Edit Reception Video', 'Editorial Bridal Portraits', 'Fine Art Leather Album'];

  const toggleService = (srv) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !message) {
      alert('Please fill in all contact and requirement fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        vendorId: vendor._id,
        clientName,
        clientEmail,
        clientPhone,
        eventType,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        location,
        guestCount,
        budgetRange,
        message,
        servicesNeeded: selectedServices
      };

      const res = await axios.post(`${API_BASE}/inquiries`, payload);
      setSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setSubmitting(false);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-stone-200/90 dark:border-stone-800 my-4 sm:my-8 overflow-hidden max-h-[92vh] overflow-y-auto text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quote request modal"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-300/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2">Quote Request Sent!</h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto mb-6">
              Your inquiry has been directly dispatched to <span className="font-bold text-stone-900 dark:text-white">{vendor.name}</span> and registered in the platform curation dashboard. The studio will reach out via phone & email.
            </p>
            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto mb-6 text-left space-y-1">
              <p><span className="font-bold text-stone-800 dark:text-stone-200">Vendor:</span> {vendor.name}</p>
              <p><span className="font-bold text-stone-800 dark:text-stone-200">Event Type:</span> {eventType}</p>
              <p><span className="font-bold text-stone-800 dark:text-stone-200">Direct Phone:</span> {vendor.contactPhone || '+251 91 123 4567'}</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              Close & Return to Feed
            </button>
          </div>
        ) : (
          <div>
            {/* Header with Vendor Info */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-stone-200 dark:border-stone-800 mb-6">
              <img
                src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={vendor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-gold-400"
              />
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase font-bold text-gold-700 dark:text-gold-300 bg-gold-100 dark:bg-gold-950/60 px-2 py-0.5 rounded-md border border-gold-300/40 dark:border-gold-700/40">
                    Direct Quote Request
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500">• Admin-Verified</span>
                </div>
                <h3 id="inquiry-modal-title" className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  Inquire with {vendor.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{vendor.location || 'Addis Ababa'}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Client Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Bethlehem & Yonas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Phone Number (with Telegram) *</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+251 91 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
              </div>

              {/* Event Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="Modern Wedding">Modern Wedding</option>
                    <option value="Traditional Melse">Traditional Melse</option>
                    <option value="Corporate Gala">Corporate Gala</option>
                    <option value="Private Celebration">Private Celebration</option>
                    <option value="Engagement">Engagement</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Target Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Guest Count</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="50 - 150 Guests (Intimate)">50 - 150 Guests (Intimate)</option>
                    <option value="150 - 300 Guests">150 - 300 Guests</option>
                    <option value="300 - 500 Guests (Standard Ballroom)">300 - 500 Guests (Standard Ballroom)</option>
                    <option value="500 - 1000+ Guests (Grand Hall)">500 - 1000+ Guests (Grand Hall)</option>
                  </select>
                </div>
              </div>

              {/* Budget & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Estimated Budget Range</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="75,000 - 120,000 ETB">75,000 - 120,000 ETB</option>
                    <option value="120,000 - 200,000 ETB">120,000 - 200,000 ETB</option>
                    <option value="200,000 - 350,000 ETB">200,000 - 350,000 ETB</option>
                    <option value="350,000+ ETB (Luxury Tier)">350,000+ ETB (Luxury Tier)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Planned Venue / Area</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ethiopian Skylight Ballroom, Bole"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs min-h-[44px] focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Services Checkboxes */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">Specific Services Required</label>
                <div className="flex flex-wrap gap-2">
                  {servicesOptions.map((srv) => (
                    <button
                      type="button"
                      key={srv}
                      onClick={() => toggleService(srv)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition min-h-[40px] flex items-center cursor-pointer ${
                        selectedServices.includes(srv)
                          ? 'bg-gold-500 text-stone-950 border-gold-600 font-bold'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Project Concept & Aesthetic Notes *</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details regarding preferred color theme, specific stage requirements, or questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-base sm:text-xs focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white text-xs font-bold shadow-md shadow-gold-600/30 transition transform active:scale-95 disabled:opacity-50 min-h-[44px] cursor-pointer"
                >
                  {submitting ? (
                    <span>Dispatched...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Quote Request</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
