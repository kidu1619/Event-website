import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';
import {
  ShieldCheck,
  Users,
  Sparkles,
  PlusCircle,
  MessageSquareText,
  Trash2,
  CheckCircle2,
  Clock,
  Palette,
  Camera,
  Search,
  Filter,
  Check,
  Building2,
  Phone,
  Mail,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export default function AdminPortal({
  vendors,
  onRefreshData,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'inquiries' | 'add-vendor' | 'add-inspiration'
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Vendor Approval State
  const [allVendors, setAllVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [vendorFilter, setVendorFilter] = useState('pending'); // 'pending' | 'active' | 'all'

  // New Vendor Form State (Direct Onboard)
  const [vendorName, setVendorName] = useState('');
  const [vendorCategory, setVendorCategory] = useState('Decor');
  const [vendorTagline, setVendorTagline] = useState('');
  const [vendorBio, setVendorBio] = useState('');
  const [vendorLocation, setVendorLocation] = useState('Addis Ababa (Bole)');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorInstagram, setVendorInstagram] = useState('');
  const [vendorStartingPrice, setVendorStartingPrice] = useState('95,000 ETB');
  const [vendorAvatar, setVendorAvatar] = useState('');
  const [vendorCover, setVendorCover] = useState('');
  const [vendorSpecialties, setVendorSpecialties] = useState('');
  const [submittingVendor, setSubmittingVendor] = useState(false);

  // New Inspiration Form State
  const [inspTitle, setInspTitle] = useState('');
  const [inspDescription, setInspDescription] = useState('');
  const [inspImageUrl, setInspImageUrl] = useState('');
  const [inspCategory, setInspCategory] = useState('Decor');
  const [inspEventType, setInspEventType] = useState('Modern Wedding');
  const [inspVendorId, setInspVendorId] = useState(vendors[0]?._id || '');
  const [inspPalette, setInspPalette] = useState('#F9F6F0, #C5A880, #2F3E46');
  const [inspTags, setInspTags] = useState('Glasshouse, White Florals, Luxury Stage');
  const [inspFeatured, setInspFeatured] = useState(false);
  const [submittingInsp, setSubmittingInsp] = useState(false);

  // Helper to read selected local file as Base64 Data URL
  const handleLocalFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result);
      onShowToast('File loaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Load Admin Stats, Inquiries & All Vendors
  useEffect(() => {
    loadStats();
    loadInquiries();
    loadAllVendors();
  }, []);

  const loadStats = () => {
    axios.get(`${API_BASE}/admin/stats`)
      .then(res => setStats(res.data.metrics))
      .catch(err => console.error('Admin stats error:', err));
  };

  const loadInquiries = () => {
    setLoadingInquiries(true);
    axios.get(`${API_BASE}/inquiries`)
      .then(res => {
        setInquiries(res.data);
        setLoadingInquiries(false);
      })
      .catch(err => {
        console.error('Inquiries error:', err);
        setLoadingInquiries(false);
      });
  };

  const loadAllVendors = () => {
    setLoadingVendors(true);
    axios.get(`${API_BASE}/vendors?status=all`)
      .then(res => {
        setAllVendors(res.data);
        setLoadingVendors(false);
      })
      .catch(err => {
        console.error('Error loading all vendors:', err);
        setLoadingVendors(false);
      });
  };

  // Filter vendors based on status
  const pendingVendors = allVendors.filter(v => v.status === 'pending');
  const activeVendors = allVendors.filter(v => v.status !== 'pending');

  const displayedVendors = vendorFilter === 'pending'
    ? pendingVendors
    : vendorFilter === 'active'
    ? activeVendors
    : allVendors;

  // Handle Approve Vendor Application
  const handleApproveVendor = async (vendor) => {
    try {
      const res = await axios.patch(`${API_BASE}/vendors/${vendor._id}/approve`);
      const inspCount = res.data.newInspirationsCount || 0;
      onShowToast(
        inspCount > 0
          ? `"${vendor.name}" approved! Published to Curated Vendors & added ${inspCount} visual(s) to Inspiration Feed!`
          : `"${vendor.name}" is now approved and published live!`,
        'success'
      );
      loadAllVendors();
      if (onRefreshData) onRefreshData();
      loadStats();
    } catch (err) {
      console.error('Approval error:', err);
      onShowToast('Failed to approve vendor.', 'error');
    }
  };

  // Handle Reject/Delete Vendor Application
  const handleRejectVendor = async (vendor) => {
    if (!window.confirm(`Are you sure you want to decline and remove "${vendor.name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/vendors/${vendor._id}`);
      onShowToast(`Vendor registration for "${vendor.name}" declined.`, 'info');
      loadAllVendors();
      if (onRefreshData) onRefreshData();
      loadStats();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      onShowToast('Failed to delete vendor.', 'error');
    }
  };

  // Handle Direct Onboard Vendor
  const handleOnboardVendor = async (e) => {
    e.preventDefault();
    if (!vendorName.trim() || !vendorPhone.trim()) {
      onShowToast('Please provide vendor name and phone number.', 'error');
      return;
    }

    setSubmittingVendor(true);
    try {
      await axios.post(`${API_BASE}/vendors`, {
        name: vendorName,
        category: vendorCategory,
        tagline: vendorTagline,
        bio: vendorBio,
        location: vendorLocation,
        contactPhone: vendorPhone,
        contactEmail: vendorEmail,
        instagram: vendorInstagram,
        startingPrice: vendorStartingPrice,
        avatar: vendorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        coverImage: vendorCover || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        specialties: vendorSpecialties.split(',').map(s => s.trim()).filter(Boolean),
        isVerified: true,
        status: 'active'
      });

      onShowToast(`Vendor "${vendorName}" onboarded and verified!`, 'success');
      setVendorName('');
      setVendorTagline('');
      setVendorBio('');
      setVendorPhone('');
      setVendorEmail('');
      setVendorInstagram('');
      setVendorAvatar('');
      setVendorCover('');
      setVendorSpecialties('');
      setSubmittingVendor(false);
      loadAllVendors();
      if (onRefreshData) onRefreshData();
      loadStats();
    } catch (err) {
      console.error('Error onboarding vendor:', err);
      setSubmittingVendor(false);
      onShowToast('Failed to onboard vendor.', 'error');
    }
  };

  // Handle Create Inspiration
  const handleCreateInspiration = async (e) => {
    e.preventDefault();
    if (!inspTitle.trim() || !inspImageUrl.trim()) {
      onShowToast('Please provide title and image URL/file.', 'error');
      return;
    }

    setSubmittingInsp(true);
    try {
      await axios.post(`${API_BASE}/inspirations`, {
        title: inspTitle,
        description: inspDescription,
        imageUrl: inspImageUrl,
        category: inspCategory,
        eventType: inspEventType,
        vendorId: inspVendorId || vendors[0]?._id,
        palette: inspPalette.split(',').map(s => s.trim()).filter(Boolean),
        tags: inspTags.split(',').map(s => s.trim()).filter(Boolean),
        featured: inspFeatured
      });

      onShowToast('New curated inspiration published to feed!', 'success');
      setInspTitle('');
      setInspDescription('');
      setInspImageUrl('');
      setSubmittingInsp(false);
      if (onRefreshData) onRefreshData();
      loadStats();
    } catch (err) {
      console.error('Error creating inspiration:', err);
      setSubmittingInsp(false);
      onShowToast('Failed to create inspiration.', 'error');
    }
  };

  // Handle Update Inquiry Status
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/inquiries/${inquiryId}/status`, {
        status: newStatus
      });
      loadInquiries();
      onShowToast(`Inquiry marked as ${newStatus}`, 'success');
    } catch (err) {
      console.error('Error updating status:', err);
      onShowToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Clear, Easy-to-Understand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Admin Portal & Approvals
          </h1>
          <p className="text-stone-500 text-sm mt-1 max-w-2xl">
            Review and approve vendor self-registrations, monitor client quote requests, and curate high-resolution visual inspirations for the live platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadAllVendors();
              loadInquiries();
              loadStats();
              onShowToast('Data refreshed', 'info');
            }}
            className="p-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            title="Refresh portal data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            System Live
          </span>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Pending Applications</span>
          <span className="font-serif font-bold text-2xl text-amber-600 mt-1 block">
            {pendingVendors.length}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold">Requires Review</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Published Studios</span>
          <span className="font-serif font-bold text-2xl text-stone-900 mt-1 block">
            {activeVendors.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Verified Live</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Client Quote Leads</span>
          <span className="font-serif font-bold text-2xl text-gold-700 mt-1 block">
            {inquiries.length}
          </span>
          <span className="text-[11px] text-stone-500 font-semibold">Submitted by Couples</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Visual Inspirations</span>
          <span className="font-serif font-bold text-2xl text-stone-900 mt-1 block">
            {stats?.totalInspirations ?? '...'}
          </span>
          <span className="text-[11px] text-stone-500 font-semibold">In Masonry Feed</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-200 no-scrollbar">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-gold-400" />
          <span>Vendor Applications</span>
          {pendingVendors.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingVendors.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <MessageSquareText className="w-4 h-4 text-gold-400" />
          <span>Client Quote Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add-vendor')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'add-vendor'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-gold-400" />
          <span>Direct Onboard Vendor</span>
        </button>

        <button
          onClick={() => setActiveTab('add-inspiration')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'add-inspiration'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Publish Curated Work</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: VENDOR APPLICATIONS & APPROVALS                    */}
      {/* ========================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          
          {/* Status Sub-Filters */}
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVendorFilter('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  vendorFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Pending Review ({pendingVendors.length})
              </button>
              <button
                onClick={() => setVendorFilter('active')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  vendorFilter === 'active'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Approved Live ({activeVendors.length})
              </button>
              <button
                onClick={() => setVendorFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  vendorFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Vendors ({allVendors.length})
              </button>
            </div>

            <span className="text-xs text-stone-500">
              {vendorFilter === 'pending' && 'Showing self-registered creators waiting for admin approval'}
              {vendorFilter === 'active' && 'Showing creators published on the public directory'}
              {vendorFilter === 'all' && 'Showing entire creator registry'}
            </span>
          </div>

          {/* Vendors List */}
          {loadingVendors ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
              <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-stone-500">Loading vendor applications...</span>
            </div>
          ) : displayedVendors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {vendorFilter === 'pending' ? 'No Pending Vendor Applications' : 'No Vendors Found'}
              </h3>
              <p className="text-stone-500 text-xs mt-1 max-w-md mx-auto">
                {vendorFilter === 'pending'
                  ? 'All vendor self-registrations have been reviewed and approved.'
                  : 'No vendor records match the selected filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedVendors.map((v) => {
                const isPending = v.status === 'pending';
                return (
                  <div
                    key={v._id}
                    className={`bg-white rounded-3xl p-6 border transition shadow-xs ${
                      isPending
                        ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/50'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      
                      {/* Left: Vendor Profile Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={v.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-stone-200 shrink-0"
                        />

                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-serif text-lg font-bold text-stone-900">{v.name}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-100 text-gold-900">
                              {v.category}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isPending
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isPending ? 'Pending Admin Approval' : 'Active / Published'}
                            </span>
                          </div>

                          {v.tagline && (
                            <p className="text-xs text-stone-600 font-medium italic">
                              "{v.tagline}"
                            </p>
                          )}

                          <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
                            {v.bio || 'No creative bio submitted.'}
                          </p>

                          {/* Contact & Rates Pill Strip */}
                          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-600">
                            <span className="flex items-center gap-1 font-semibold text-stone-900">
                              <Phone className="w-3.5 h-3.5 text-gold-600" /> {v.contactPhone || 'No Phone'}
                            </span>
                            {v.contactEmail && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-stone-400" /> {v.contactEmail}
                              </span>
                            )}
                            <span className="text-stone-300">•</span>
                            <span>{v.location}</span>
                            <span className="text-stone-300">•</span>
                            <span>Starting: <strong className="text-stone-900">{v.startingPrice || 'N/A'}</strong> ({v.priceRange})</span>
                          </div>

                          {/* Specialties */}
                          {v.specialties && v.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {v.specialties.map((spec, sidx) => (
                                <span key={sidx} className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-[10px] font-medium">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Uploaded Portfolio Photos Preview */}
                          {v.portfolioImages && v.portfolioImages.length > 0 && (
                            <div className="pt-3">
                              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                                Submitted Portfolio Works ({v.portfolioImages.length}):
                              </span>
                              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {v.portfolioImages.map((img, iidx) => (
                                  <div key={iidx} className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                                    <img src={img} alt="Portfolio" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Approval Actions */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApproveVendor(v)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition transform hover:scale-[1.02]"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve & Publish Live</span>
                            </button>

                            <button
                              onClick={() => handleRejectVendor(v)}
                              className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Decline Request</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Published
                            </span>
                            <button
                              onClick={() => handleRejectVendor(v)}
                              className="p-2 text-stone-400 hover:text-rose-600 rounded-xl"
                              title="Delete vendor from directory"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLIENT QUOTE INQUIRIES                            */}
      {/* ========================================================= */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Incoming Direct Quote Requests</h3>
              <p className="text-xs text-stone-500">Track and manage communications between event hosts and verified vendors.</p>
            </div>
            <button
              onClick={loadInquiries}
              className="text-xs font-bold text-gold-700 hover:text-gold-800"
            >
              Refresh
            </button>
          </div>

          {loadingInquiries ? (
            <div className="text-center py-10 text-stone-400 text-xs">Loading quote inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl">
              <MessageSquareText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-500 text-xs">No client quote requests received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq._id} className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition bg-stone-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{inq.clientName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'New' || inq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                          inq.status === 'Contacted' || inq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Requested for: <strong className="text-stone-900">{inq.vendorId?.name || 'Selected Vendor'}</strong> ({inq.vendorId?.category})
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-500">
                        <span>📞 {inq.clientPhone}</span>
                        <span>✉️ {inq.clientEmail}</span>
                        <span>📍 {inq.location || 'Addis Ababa'}</span>
                        <span>🎉 {inq.eventType}</span>
                        {inq.budgetRange && <span>💰 {inq.budgetRange}</span>}
                      </div>
                      <p className="text-xs text-stone-700 mt-3 p-3 bg-white rounded-xl border border-stone-200 leading-relaxed">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="booked">Booked</option>
                      </select>
                      <a
                        href={`tel:${inq.clientPhone}`}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
                      >
                        Call Client
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DIRECT ONBOARD CURATED VENDOR                      */}
      {/* ========================================================= */}
      {activeTab === 'add-vendor' && (
        <form onSubmit={handleOnboardVendor} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-3xl">
          <div className="border-b border-stone-200 pb-4 mb-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">Direct Admin Vendor Onboarding</h3>
            <p className="text-xs text-stone-500">Instantly register and publish a pre-verified vendor to the directory.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Business Name *</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Roha Scenography"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category *</label>
                <select
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  <option value="Decor">Decor & Styling</option>
                  <option value="Media">Media & Cinematography</option>
                  <option value="Catering">Catering & Pastry</option>
                  <option value="AV & Sound">AV, Sound & Lighting</option>
                  <option value="Venue">Venue & Ballrooms</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={vendorTagline}
                onChange={(e) => setVendorTagline(e.target.value)}
                placeholder="e.g. Master floristry and royal Melse stage architecture."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Studio Bio</label>
              <textarea
                rows={3}
                value={vendorBio}
                onChange={(e) => setVendorBio(e.target.value)}
                placeholder="High-end editorial aesthetic with 10+ years executing luxury weddings..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  placeholder="+251 91 ..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Official Email</label>
                <input
                  type="email"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  placeholder="contact@studio.et"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Starting Price</label>
                <input
                  type="text"
                  value={vendorStartingPrice}
                  onChange={(e) => setVendorStartingPrice(e.target.value)}
                  placeholder="e.g. 110,000 ETB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            {/* Avatar Selection with Local File Picker */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Avatar / Logo (URL or Select from Computer)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vendorAvatar}
                  onChange={(e) => setVendorAvatar(e.target.value)}
                  placeholder="Paste URL or select file..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                />
                <label className="cursor-pointer px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-stone-300 transition">
                  <Upload className="w-3.5 h-3.5 text-gold-600" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLocalFile(e, setVendorAvatar)}
                  />
                </label>
              </div>
              {vendorAvatar && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={vendorAvatar} alt="Avatar preview" className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-300" />
                  <span className="text-[11px] text-emerald-600 font-semibold">Avatar loaded</span>
                </div>
              )}
            </div>

            {/* Cover Selection with Local File Picker */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Cover Hero Image (URL or Select from Computer)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vendorCover}
                  onChange={(e) => setVendorCover(e.target.value)}
                  placeholder="Paste URL or select file..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                />
                <label className="cursor-pointer px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-stone-300 transition">
                  <Upload className="w-3.5 h-3.5 text-gold-600" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLocalFile(e, setVendorCover)}
                  />
                </label>
              </div>
              {vendorCover && (
                <div className="mt-2 rounded-xl overflow-hidden h-24 bg-stone-100 border border-stone-200">
                  <img src={vendorCover} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Specialties (Comma Separated)</label>
              <input
                type="text"
                value={vendorSpecialties}
                onChange={(e) => setVendorSpecialties(e.target.value)}
                placeholder="White Florals, Melse Canopies, 4K Drone"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submittingVendor}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white text-xs font-bold shadow-md shadow-gold-600/30 flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submittingVendor ? 'Onboarding...' : 'Onboard & Verify Vendor'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PUBLISH CURATED WORK TO FEED                      */}
      {/* ========================================================= */}
      {activeTab === 'add-inspiration' && (
        <form onSubmit={handleCreateInspiration} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-3xl">
          <div className="border-b border-stone-200 pb-4 mb-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">Publish Curated Inspiration to Feed</h3>
            <p className="text-xs text-stone-500">Add a high-resolution visual masterpiece to the platform Masonry inspiration feed.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Work Title *</label>
              <input
                type="text"
                value={inspTitle}
                onChange={(e) => setInspTitle(e.target.value)}
                placeholder="e.g. Royal Crystal Chandelier & Floral Canopy Stage"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>

            {/* Inspiration Image with Local File Picker */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Visual Image (URL or Select from Computer) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inspImageUrl}
                  onChange={(e) => setInspImageUrl(e.target.value)}
                  placeholder="Paste high-res image URL or select local file..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                  required
                />
                <label className="cursor-pointer px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-stone-300 transition">
                  <Upload className="w-3.5 h-3.5 text-gold-600" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLocalFile(e, setInspImageUrl)}
                  />
                </label>
              </div>
              {inspImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden aspect-16/9 max-h-48 bg-stone-100 border border-stone-200">
                  <img src={inspImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category *</label>
                <select
                  value={inspCategory}
                  onChange={(e) => setInspCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  <option value="Decor">Decor</option>
                  <option value="Media">Media</option>
                  <option value="Floral Art">Floral Art</option>
                  <option value="Lighting & Stage">Lighting & Stage</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Modern Luxury">Modern Luxury</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Event Type *</label>
                <select
                  value={inspEventType}
                  onChange={(e) => setInspEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  <option value="Modern Wedding">Modern Wedding</option>
                  <option value="Traditional Melse">Traditional Melse</option>
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Private Celebration">Private Celebration</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Fashion & Editorial">Fashion & Editorial</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Attributed Vendor *</label>
                <select
                  value={inspVendorId}
                  onChange={(e) => setInspVendorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  {allVendors.map((v) => (
                    <option key={v._id} value={v._id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Color Palette (Hex Comma Separated)</label>
                <input
                  type="text"
                  value={inspPalette}
                  onChange={(e) => setInspPalette(e.target.value)}
                  placeholder="#F9F6F0, #C5A880, #2F3E46"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={inspTags}
                  onChange={(e) => setInspTags(e.target.value)}
                  placeholder="White Roses, Crystal, Ballroom, Stage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="inspFeatured"
                checked={inspFeatured}
                onChange={(e) => setInspFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <label htmlFor="inspFeatured" className="text-xs font-bold text-stone-700">
                Mark as Featured Inspiration (Shown on top of feed)
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submittingInsp}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white text-xs font-bold shadow-md shadow-gold-600/30 flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submittingInsp ? 'Publishing...' : 'Publish Curated Inspiration'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}
