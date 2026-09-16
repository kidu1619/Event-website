import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Send, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  MessageSquareText, 
  DollarSign, 
  Clock, 
  Award,
  Layers
} from 'lucide-react';

export default function VendorProfileModal({
  vendor,
  onClose,
  onInquireVendor,
  onOpenInspiration,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [inspirations, setInspirations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Bride / Groom');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (vendor?._id) {
      setLoadingDetails(true);
      axios.get(`${API_BASE}/vendors/${vendor._id}`)
        .then(res => {
          setInspirations(res.data.inspirations || []);
          setReviews(res.data.reviews || []);
          setLoadingDetails(false);
        })
        .catch(err => {
          console.error('Error fetching vendor details:', err);
          setLoadingDetails(false);
        });
    }
  }, [vendor]);

  if (!vendor) return null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      onShowToast('Please fill in your name and review comment.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(`${API_BASE}/reviews`, {
        vendorId: vendor._id,
        authorName,
        authorRole,
        rating: Number(rating),
        comment
      });

      setReviews([res.data, ...reviews]);
      setComment('');
      setAuthorName('');
      setSubmittingReview(false);
      onShowToast('Review submitted successfully! Thank you for sharing your experience.', 'success');
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmittingReview(false);
      onShowToast('Failed to submit review.', 'error');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-profile-title"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 my-4 sm:my-6 max-h-[92vh] flex flex-col text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close vendor profile"
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-stone-900/70 hover:bg-stone-900 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-white backdrop-blur-md flex items-center justify-center transition shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          
          {/* Header Banner */}
          <div className="relative h-64 sm:h-80 bg-stone-900">
            <img
              src={vendor.coverImage || vendor.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            {/* Profile Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-end gap-4">
                <img
                  src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={vendor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white dark:border-stone-800 shadow-xl bg-white dark:bg-stone-800 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-stone-950 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {vendor.badge || 'Admin Curated'}
                    </span>
                    <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                      {vendor.category}
                    </span>
                  </div>
                  <h2 id="vendor-profile-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {vendor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{vendor.location || 'Addis Ababa, Ethiopia'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gold-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                      {vendor.rating || 5.0} ({reviews.length || vendor.reviewsCount || 1} Reviews)
                    </span>
                  </p>
                </div>
              </div>

              {/* Direct Quote CTA */}
              <button
                onClick={() => {
                  onClose();
                  onInquireVendor(vendor);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 text-xs sm:text-sm font-bold shadow-lg shadow-gold-500/25 flex items-center justify-center gap-2 transition transform active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>Request Free Quote</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Experience</span>
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">{vendor.experienceYears || 6}+ Years</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Completed Events</span>
              <span className="font-serif font-bold text-gold-700 dark:text-gold-400 text-base">{vendor.completedEvents || 150}+ Events</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Price Range</span>
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">{vendor.priceRange || '$$$'} ({vendor.startingPrice || '100k+ ETB'})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Curation Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-stone-200 dark:border-stone-800 flex items-center gap-6">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'border-gold-600 text-gold-700 dark:text-gold-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Curated Portfolio ({inspirations.length})
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'packages'
                  ? 'border-gold-600 text-gold-700 dark:text-gold-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Service Packages & Pricing
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-gold-600 text-gold-700 dark:text-gold-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Verified Client Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'about'
                  ? 'border-gold-600 text-gold-700 dark:text-gold-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              Studio Bio & Credentials
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8">
            
            {/* 1. Curated Portfolio */}
            {activeTab === 'portfolio' && (
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-4">
                  Verified Scenography & Media Works
                </h4>
                {inspirations.length === 0 ? (
                  <p className="text-stone-400 text-xs py-8 text-center">No portfolio items linked yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {inspirations.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          onClose();
                          onOpenInspiration(item);
                        }}
                        className="rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer group relative shadow-xs hover:shadow-md transition"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="p-3 bg-white dark:bg-stone-900">
                          <span className="text-[10px] font-bold text-gold-700 dark:text-gold-400 uppercase block">{item.eventType}</span>
                          <h5 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs line-clamp-1">{item.title}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Packages & Pricing */}
            {activeTab === 'packages' && (
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">Standardized Service Packages</h4>
                <p className="text-stone-500 dark:text-stone-400 text-xs mb-6">Pricing is transparent and customized during direct quote inquiries.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vendor.packages && vendor.packages.length > 0 ? (
                    vendor.packages.map((pkg, idx) => (
                      <div key={idx} className="bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">{pkg.name}</h5>
                            <span className="font-serif font-bold text-gold-800 dark:text-gold-400 text-base">{pkg.price}</span>
                          </div>
                          <ul className="mt-4 space-y-2">
                            {pkg.features?.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onInquireVendor(vendor);
                          }}
                          className="mt-6 w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-bold transition cursor-pointer"
                        >
                          Book Package / Request Date
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 text-center text-stone-500 dark:text-stone-400 text-xs">
                      Custom tailored packages available upon quote request. Starting at {vendor.startingPrice || '100,000 ETB'}.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Submit New Review Form */}
                <form onSubmit={handleSubmitReview} className="bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700">
                  <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white mb-1">Leave a Verified Review</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">Did this vendor style or shoot your event? Share your feedback with future hosts.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Hanna & Robel"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">Your Role / Event</label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder="e.g. Wedding Couple, Event Host"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                      >
                        <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                        <option value="4">★★★★☆ (4 Stars - Great)</option>
                        <option value="3">★★★☆☆ (3 Stars - Average)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">Review Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="2"
                      placeholder="Describe the styling quality, communication, and overall execution..."
                      className="w-full px-3 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-stone-400 text-xs text-center py-6">No reviews submitted yet.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{rev.authorName}</span>
                            <span className="text-[10px] text-stone-400">• {rev.authorRole || 'Event Host'}</span>
                          </div>
                          <div className="flex items-center text-gold-500 text-xs">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{rev.comment}</p>
                        <span className="text-[10px] text-stone-400 mt-2 block">{rev.date || 'Recent Event'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 4. About & Credentials */}
            {activeTab === 'about' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">About The Studio</h4>
                  <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {vendor.bio}
                  </p>
                </div>

                <div>
                  <h5 className="font-serif font-bold text-stone-900 dark:text-white text-sm mb-2">Specialties & Signature Aesthetics</h5>
                  <div className="flex items-center gap-2 flex-wrap">
                    {vendor.specialties?.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-gold-50 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 border border-gold-200 dark:border-gold-700/60 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <h5 className="font-serif font-bold text-stone-900 dark:text-white text-xs mb-3 uppercase tracking-wider">Direct Studio Contact</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600 dark:text-stone-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                      <span>{vendor.contactPhone || '+251 91 123 4567'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                      <span>{vendor.contactEmail || 'contact@studioplatform.et'}</span>
                    </div>
                    {vendor.instagram && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        <span>{vendor.instagram}</span>
                      </div>
                    )}
                    {vendor.telegram && (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>{vendor.telegram}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
