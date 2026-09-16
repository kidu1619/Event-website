import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sparkles,
  Building2,
  Camera,
  Layers,
  Phone,
  Mail,
  Send,
  Globe,
  MapPin,
  Tag,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  User,
  KeyRound,
  Heart,
  Calendar,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
  MessageSquare,
  Image as ImageIcon,
  LogIn,
  LogOut,
  ChevronRight,
  Upload,
  AlertCircle,
  Smartphone,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

// Custom sleek Instagram icon
const InstagramIcon = ({ className = "w-4 h-4 text-stone-400" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import { API_BASE } from '../config/api';

// Fast client-side image compression utility using HTML5 canvas
// Automatically reduces 5-20MB phone/camera images to ~150-250KB while keeping high visual clarity
const compressImageFile = (file, maxWidth = 1280, maxHeight = 1280, quality = 0.82) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(event.target.result);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

// Curated sample presets for 1-click test fill
const SAMPLE_PRESETS = {
  Decor: {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  Media: {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  Catering: {
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  'AV & Sound': {
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  Venue: {
    avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1000&q=80'
    ]
  }
};

export default function VendorPortal({
  vendors,
  currentVendor,
  onVendorChange,
  onOpenVendorProfile,
  onRefreshData,
  onShowToast
}) {
  const [vendorNav, setVendorNav] = useState(currentVendor ? 'portfolio' : 'register');

  // Sign In modal state & alternate sign-in modes ('password' | 'otp' | 'forgot')
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [signInMode, setSignInMode] = useState('password');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Phone OTP Sign-In state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpDemoCode, setOtpDemoCode] = useState('');

  // Forgot Password recovery state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotToken, setForgotToken] = useState('');
  const [forgotVendorName, setForgotVendorName] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotDemoOtp, setForgotDemoOtp] = useState('');

  // Security: Lockout countdown and live status refresh
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // ----------------------------------------------------
  // REGISTRATION FORM STATE
  // ----------------------------------------------------
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regCategory, setRegCategory] = useState('Decor');
  const [regTagline, setRegTagline] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regLocation, setRegLocation] = useState('Addis Ababa (Bole)');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regTelegram, setRegTelegram] = useState('');
  const [regWebsite, setRegWebsite] = useState('');
  const [regPriceRange, setRegPriceRange] = useState('$$$');
  const [regStartingPrice, setRegStartingPrice] = useState('85,000 ETB');
  const [regAvatar, setRegAvatar] = useState('');
  const [regCover, setRegCover] = useState('');
  const [regExperience, setRegExperience] = useState(4);
  const [regEvents, setRegEvents] = useState(65);
  const [regSpecialties, setRegSpecialties] = useState('Luxury Stage Design, Melse Backdrops, Floral Sculptures');
  
  // Portfolio image URLs list in registration
  const [regPortfolioImages, setRegPortfolioImages] = useState([
    'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  // Packages list in registration
  const [regPackages, setRegPackages] = useState([
    {
      name: 'Signature Full Celebration Package',
      price: '160,000 ETB',
      features: ['Full Stage & Lighting Arch', 'Bridal Table & Floral Runners', 'Guest Table Centerpieces (15 tables)']
    }
  ]);

  const [registering, setRegistering] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [regFormError, setRegFormError] = useState('');

  // ----------------------------------------------------
  // VENDOR DASHBOARD STATE
  // ----------------------------------------------------
  const [vendorInspirations, setVendorInspirations] = useState([]);
  const [loadingInspirations, setLoadingInspirations] = useState(false);

  // Post new inspiration work form state
  const [newInspTitle, setNewInspTitle] = useState('');
  const [newInspImage, setNewInspImage] = useState('');
  const [newInspCategory, setNewInspCategory] = useState(currentVendor?.category || 'Decor');
  const [newInspEventType, setNewInspEventType] = useState('Modern Wedding');
  const [newInspPalette, setNewInspPalette] = useState('#FDFBF7, #D4AF37, #2D3748');
  const [newInspTags, setNewInspTags] = useState('Luxury Stage, Floral Arch, Addis Wedding');
  const [newInspAspectRatio, setNewInspAspectRatio] = useState('4/5');
  const [newInspDesc, setNewInspDesc] = useState('');
  const [submittingInsp, setSubmittingInsp] = useState(false);

  // Direct portfolio gallery addition state
  const [directAddPhotoUrl, setDirectAddPhotoUrl] = useState('');
  const [addingPhoto, setAddingPhoto] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Profile Edit State
  const [editProfile, setEditProfile] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Synchronize when currentVendor changes
  useEffect(() => {
    if (currentVendor) {
      setEditProfile({
        name: currentVendor.name || '',
        tagline: currentVendor.tagline || '',
        bio: currentVendor.bio || '',
        location: currentVendor.location || '',
        contactPhone: currentVendor.contactPhone || '',
        contactEmail: currentVendor.contactEmail || '',
        instagram: currentVendor.instagram || '',
        telegram: currentVendor.telegram || '',
        website: currentVendor.website || '',
        priceRange: currentVendor.priceRange || '$$$',
        startingPrice: currentVendor.startingPrice || '',
        avatar: currentVendor.avatar || '',
        coverImage: currentVendor.coverImage || ''
      });

      // Load vendor's posted inspirations
      loadVendorInspirations(currentVendor._id);
      loadVendorInquiries(currentVendor._id);
    }
  }, [currentVendor]);

  // Load inspirations authored by this vendor
  const loadVendorInspirations = async (vendorId) => {
    try {
      setLoadingInspirations(true);
      const res = await axios.get(`${API_BASE}/inspirations?vendorId=${vendorId}`);
      setVendorInspirations(res.data);
    } catch (err) {
      console.error('Error loading vendor inspirations:', err);
    } finally {
      setLoadingInspirations(false);
    }
  };

  // Load inquiries directed to this vendor
  const loadVendorInquiries = async (vendorId) => {
    try {
      setLoadingInquiries(true);
      const res = await axios.get(`${API_BASE}/inquiries?vendorId=${vendorId}`);
      setInquiries(res.data);
    } catch (err) {
      console.error('Error loading vendor inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Helper: Read and compress a single local file as Base64 Data URL
  const handleSingleFileUpload = async (file, setter) => {
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1280, 1280, 0.82);
      if (compressed) {
        setter(compressed);
        onShowToast('Photo loaded and optimized!', 'success');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Could not load image file.', 'error');
    }
  };

  // Helper: Read and compress multiple files for the portfolio gallery
  const handleMultipleFilesUpload = async (files, appender) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    onShowToast(`Optimizing and adding ${fileList.length} photo(s)...`, 'info');
    let loadedCount = 0;
    for (const file of fileList) {
      try {
        const compressed = await compressImageFile(file, 1280, 1280, 0.82);
        if (compressed) {
          appender(compressed);
          loadedCount++;
        }
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }
    if (loadedCount > 0) {
      onShowToast(`Added ${loadedCount} photo(s) to portfolio!`, 'success');
    }
  };

  // Preset sample filler for registration
  const applyCategoryPreset = (category) => {
    setRegCategory(category);
    const preset = SAMPLE_PRESETS[category];
    if (preset) {
      setRegAvatar(preset.avatar);
      setRegCover(preset.cover);
      setRegPortfolioImages(preset.portfolio);
    }
  };

  // Handle Adding Portfolio Image via URL in Registration
  const handleAddRegPortfolioImage = () => {
    if (!newPortfolioUrl.trim()) return;
    setRegPortfolioImages(prev => [...prev, newPortfolioUrl.trim()]);
    setNewPortfolioUrl('');
  };

  // Handle Remove Portfolio Image in Registration
  const handleRemoveRegPortfolioImage = (index) => {
    setRegPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  // ----------------------------------------------------
  // SUBMIT VENDOR REGISTRATION (Sent for Admin Review)
  // ----------------------------------------------------
  const handleRegisterVendor = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setRegFormError('');
    const newErrors = {};

    if (!regName || !regName.trim()) {
      newErrors.name = 'Please provide your Business / Brand Name.';
    }
    if (!regUsername || !regUsername.trim()) {
      newErrors.username = 'Please choose a Username for your vendor account.';
    }
    if (!regPassword || regPassword.trim().length < 4) {
      newErrors.password = 'Password must be at least 4 characters.';
    }
    if (!regPhone || !regPhone.trim()) {
      newErrors.phone = 'Please provide a contact Phone Number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setRegErrors(newErrors);
      const firstError = newErrors.name ? 'Business Name' : newErrors.username ? 'Username' : newErrors.password ? 'Password' : 'Phone Number';
      const errorMsg = `Required field missing: Please provide your ${firstError}.`;
      setRegFormError(errorMsg);
      onShowToast(errorMsg, 'error');

      // Smoothly scroll to the missing field
      const targetId = newErrors.name ? 'regNameInput' : newErrors.username ? 'regUsernameInput' : newErrors.password ? 'regPasswordInput' : 'regPhoneInput';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setRegErrors({});
    setRegistering(true);

    try {
      const payload = {
        name: regName.trim(),
        username: regUsername.trim().toLowerCase(),
        password: regPassword.trim(),
        category: regCategory,
        tagline: regTagline.trim() || `${regCategory} Specialist in Addis Ababa`,
        bio: regBio.trim() || `Passionate professional delivering exceptional ${regCategory.toLowerCase()} services.`,
        location: regLocation.trim() || 'Addis Ababa, Ethiopia',
        contactPhone: regPhone.trim(),
        contactEmail: regEmail.trim(),
        instagram: regInstagram.trim(),
        telegram: regTelegram.trim(),
        website: regWebsite.trim(),
        priceRange: regPriceRange,
        startingPrice: regStartingPrice.trim(),
        avatar: regAvatar.trim() || SAMPLE_PRESETS[regCategory]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        coverImage: regCover.trim() || SAMPLE_PRESETS[regCategory]?.cover || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        portfolioImages: regPortfolioImages,
        specialties: regSpecialties ? regSpecialties.split(',').map(s => s.trim()).filter(Boolean) : [],
        packages: regPackages,
        experienceYears: Number(regExperience) || 3,
        completedEvents: Number(regEvents) || 30
      };

      const res = await axios.post(`${API_BASE}/vendors/register`, payload, {
        timeout: 25000
      });
      const newVendor = res.data.vendor;

      onShowToast(`Application submitted! Awaiting Admin approval before publishing live.`, 'success');
      onVendorChange(newVendor);
      if (onRefreshData) onRefreshData();
      setVendorNav('portfolio');
    } catch (err) {
      console.error('Registration failed:', err);
      let msg = 'Registration failed. Please check your details.';
      if (err.response?.status === 413) {
        msg = 'Your uploaded photos are too large. Please select fewer or smaller images.';
      } else if (err.code === 'ECONNABORTED' || (err.message && err.message.includes('Network Error'))) {
        msg = 'Connection error: Unable to reach the server. Please verify your connection or try again.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setRegFormError(msg);
      onShowToast(msg, 'error');
    } finally {
      setRegistering(false);
    }
  };

  // ----------------------------------------------------
  // VENDOR SIGN-IN
  // ----------------------------------------------------
  const handleVendorLogin = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      onShowToast('Enter your registered username or email.', 'error');
      return;
    }
    if (!loginPassword.trim()) {
      onShowToast('Please enter your password.', 'error');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/vendors/login`, {
        username: loginIdentifier.trim(),
        password: loginPassword.trim()
      });
      setLockoutRemaining(0);
      onVendorChange(res.data.vendor);
      setShowLoginModal(false);
      setLoginIdentifier('');
      setLoginPassword('');
      onShowToast(`Welcome back, ${res.data.vendor.name}!`, 'success');
      setVendorNav('portfolio');
    } catch (err) {
      if (err.response?.status === 429) {
        const secs = err.response?.data?.remainingSeconds || 300;
        setLockoutRemaining(secs);
      }
      const msg = err.response?.data?.message || 'Invalid username or password.';
      onShowToast(msg, 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // ----------------------------------------------------
  // ALTERNATE SIGN-IN: REQUEST PHONE OTP
  // ----------------------------------------------------
  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!otpPhone.trim()) {
      onShowToast('Enter your registered phone number.', 'error');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/vendors/otp-request`, { phone: otpPhone.trim() });
      setOtpSent(true);
      setOtpDemoCode(res.data.demoOtp || '');
      onShowToast(res.data.message || 'Verification code sent to your phone!', 'info');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not send verification code.';
      onShowToast(msg, 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  // ----------------------------------------------------
  // ALTERNATE SIGN-IN: VERIFY PHONE OTP
  // ----------------------------------------------------
  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!otpCode.trim()) {
      onShowToast('Enter the 4-digit code sent to your phone.', 'error');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/vendors/otp-verify`, {
        phone: otpPhone.trim(),
        otp: otpCode.trim()
      });
      setLockoutRemaining(0);
      onVendorChange(res.data.vendor);
      setShowLoginModal(false);
      setOtpPhone('');
      setOtpCode('');
      setOtpSent(false);
      setOtpDemoCode('');
      onShowToast(res.data.message || `Welcome back, ${res.data.vendor.name}!`, 'success');
      setVendorNav('portfolio');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired code.';
      onShowToast(msg, 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  // ----------------------------------------------------
  // FORGOT PASSWORD: FIND ACCOUNT
  // ----------------------------------------------------
  const handleForgotLookup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!forgotIdentifier.trim()) {
      onShowToast('Enter your registered username, phone, or email.', 'error');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/vendors/forgot-password`, {
        identifier: forgotIdentifier.trim()
      });
      setForgotVendorName(res.data.vendorName || '');
      setForgotToken(res.data.resetToken || '');
      setForgotDemoOtp(res.data.demoOtp || res.data.recoveryOtp || '');
      setForgotStep(2);
      onShowToast(`Account located for "${res.data.vendorName}"! Enter your new password.`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'No registered vendor found.';
      onShowToast(msg, 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  // ----------------------------------------------------
  // FORGOT PASSWORD: SAVE NEW PASSWORD
  // ----------------------------------------------------
  const handleResetPassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.trim().length < 4) {
      onShowToast('New password must be at least 4 characters.', 'error');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/vendors/reset-password`, {
        identifier: forgotIdentifier.trim(),
        resetToken: forgotToken,
        otp: forgotDemoOtp,
        newPassword: forgotNewPassword.trim()
      });
      setLockoutRemaining(0);
      onVendorChange(res.data.vendor);
      setShowLoginModal(false);
      setSignInMode('password');
      setForgotStep(1);
      setForgotIdentifier('');
      setForgotNewPassword('');
      setForgotToken('');
      setForgotDemoOtp('');
      onShowToast('Password updated! Signed in successfully.', 'success');
      setVendorNav('portfolio');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password.';
      onShowToast(msg, 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  // ----------------------------------------------------
  // CHECK APPROVAL STATUS LIVE
  // ----------------------------------------------------
  const handleCheckApprovalStatus = async () => {
    if (!currentVendor?._id) return;
    setRefreshingStatus(true);
    try {
      const res = await axios.get(`${API_BASE}/vendors/${currentVendor._id}`);
      if (res.data?.vendor) {
        onVendorChange(res.data.vendor);
        if (res.data.vendor.status === 'active') {
          onShowToast('🎉 Congratulations! Your business profile has been approved! Visual publishing is now unlocked.', 'success');
        } else {
          onShowToast('Your registration is currently pending admin verification.', 'info');
        }
      }
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      onShowToast('Could not refresh status.', 'error');
    } finally {
      setRefreshingStatus(false);
    }
  };

  // ----------------------------------------------------
  // POST NEW INSPIRATION WORK TO FEED
  // ----------------------------------------------------
  const handlePostInspiration = async (e) => {
    e.preventDefault();
    if (currentVendor.status !== 'active') {
      onShowToast('Visual publishing is locked until your vendor account is verified and approved by the platform administrator.', 'error');
      return;
    }

    if (!newInspTitle.trim() || !newInspImage.trim()) {
      onShowToast('Please provide a title and image for your work.', 'error');
      return;
    }

    setSubmittingInsp(true);
    try {
      await axios.post(`${API_BASE}/inspirations`, {
        title: newInspTitle.trim(),
        imageUrl: newInspImage.trim(),
        category: newInspCategory,
        eventType: newInspEventType,
        vendorId: currentVendor._id,
        aspectRatio: newInspAspectRatio,
        palette: newInspPalette.split(',').map(c => c.trim()).filter(Boolean),
        tags: newInspTags.split(',').map(t => t.trim()).filter(Boolean),
        description: newInspDesc.trim() || `Showcasing signature work by ${currentVendor.name}`
      });

      onShowToast('Visual work published to AURA Inspiration Feed!', 'success');
      setNewInspTitle('');
      setNewInspImage('');
      setNewInspDesc('');
      loadVendorInspirations(currentVendor._id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Error posting inspiration:', err);
      const errorMsg = err.response?.data?.message || 'Failed to post work. Please verify details.';
      onShowToast(errorMsg, 'error');
    } finally {
      setSubmittingInsp(false);
    }
  };

  // ----------------------------------------------------
  // ADD PHOTO DIRECTLY TO PORTFOLIO GALLERY
  // ----------------------------------------------------
  const handleAddDirectPortfolioPhoto = async (photoData) => {
    if (currentVendor.status !== 'active') {
      onShowToast('Portfolio photo uploads are locked until your vendor account is verified and approved by the platform administrator.', 'error');
      return;
    }

    const urlToAdd = typeof photoData === 'string' ? photoData : directAddPhotoUrl.trim();
    if (!urlToAdd) return;

    setAddingPhoto(true);
    try {
      const res = await axios.post(`${API_BASE}/vendors/${currentVendor._id}/portfolio`, {
        imageUrl: urlToAdd
      });
      const updatedVendor = { ...currentVendor, portfolioImages: res.data.portfolioImages };
      onVendorChange(updatedVendor);
      setDirectAddPhotoUrl('');
      onShowToast('Photo added to your portfolio gallery!', 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error adding photo to portfolio.';
      onShowToast(msg, 'error');
    } finally {
      setAddingPhoto(false);
    }
  };

  // ----------------------------------------------------
  // REMOVE PHOTO FROM PORTFOLIO GALLERY
  // ----------------------------------------------------
  const handleRemovePortfolioPhoto = async (imgUrl) => {
    try {
      const res = await axios.delete(`${API_BASE}/vendors/${currentVendor._id}/portfolio`, {
        data: { imageUrl: imgUrl }
      });
      const updatedVendor = { ...currentVendor, portfolioImages: res.data.portfolioImages };
      onVendorChange(updatedVendor);
      onShowToast('Photo removed from portfolio gallery.', 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      onShowToast('Error removing photo.', 'error');
    }
  };

  // ----------------------------------------------------
  // DELETE PUBLISHED INSPIRATION
  // ----------------------------------------------------
  const handleDeleteInspiration = async (inspId) => {
    if (!window.confirm('Delete this visual work from the Inspiration Feed?')) return;
    try {
      await axios.delete(`${API_BASE}/inspirations/${inspId}`);
      onShowToast('Visual work removed from feed.', 'success');
      loadVendorInspirations(currentVendor._id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      onShowToast('Failed to delete inspiration.', 'error');
    }
  };

  // ----------------------------------------------------
  // UPDATE INQUIRY STATUS
  // ----------------------------------------------------
  const handleUpdateInquiryStatus = async (inquiryId, status) => {
    try {
      await axios.patch(`${API_BASE}/inquiries/${inquiryId}/status`, { status });
      setInquiries(prev => prev.map(inq => inq._id === inquiryId ? { ...inq, status } : inq));
      onShowToast(`Lead status marked as "${status}"!`, 'success');
    } catch (err) {
      onShowToast('Failed to update status', 'error');
    }
  };

  // ----------------------------------------------------
  // SAVE PROFILE DETAILS
  // ----------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        ...editProfile,
        specialties: typeof editProfile.specialties === 'string'
          ? editProfile.specialties.split(',').map(s => s.trim()).filter(Boolean)
          : editProfile.specialties
      };

      const res = await axios.put(`${API_BASE}/vendors/${currentVendor._id}`, payload);
      onVendorChange(res.data);
      onShowToast('Profile details updated successfully!', 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      onShowToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      
      {/* --------------------------------------------- */}
      {/* CLEAN, CLEAR VENDOR PORTAL HEADER             */}
      {/* --------------------------------------------- */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>Vendor Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Vendor Registration & Portfolio Manager
              </h1>
              <p className="text-stone-400 text-sm max-w-2xl mt-2 leading-relaxed">
                Register your business, upload photos directly from your computer, and manage client inquiries. Applications are reviewed and approved by the Admin team before publishing live.
              </p>
            </div>

            {/* Quick Session Status / Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {currentVendor ? (
                <div className="flex items-center gap-3 bg-stone-800/90 p-2 pl-3 rounded-2xl border border-stone-700/80 backdrop-blur-sm shadow-md">
                  <img
                    src={currentVendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentVendor.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-gold-500/50"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-white">{currentVendor.name}</span>
                      {currentVendor.status === 'pending' ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pending Admin
                        </span>
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {currentVendor.category} • {currentVendor.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 ml-2 border-l border-stone-700 pl-2">
                    <button
                      onClick={() => onOpenVendorProfile(currentVendor)}
                      className="p-2 text-stone-400 hover:text-gold-400 hover:bg-stone-700/50 rounded-xl transition"
                      title="Preview public profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="p-2 text-stone-400 hover:text-white hover:bg-stone-700/50 rounded-xl transition"
                      title="Switch account"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onVendorChange(null);
                        setVendorNav('register');
                        onShowToast('Signed out of vendor session', 'info');
                      }}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 border border-stone-700 transition shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-gold-400" />
                    <span>Vendor Sign In</span>
                  </button>
                  <button
                    onClick={() => setVendorNav('register')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-gold-600 to-gold-700 text-white hover:from-gold-700 hover:to-gold-800 shadow-md shadow-gold-600/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register Business</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Navigation Bar inside Portal */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-t border-stone-800/80 pt-4 no-scrollbar">
            
            <button
              onClick={() => setVendorNav('register')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                vendorNav === 'register'
                  ? 'bg-gold-500 text-stone-950 shadow-md shadow-gold-500/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{currentVendor ? 'Register New Business' : '1. Register Business'}</span>
            </button>

            {currentVendor && (
              <>
                <button
                  onClick={() => setVendorNav('portfolio')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    vendorNav === 'portfolio'
                      ? 'bg-gold-500 text-stone-950 shadow-md shadow-gold-500/20'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>2. Portfolio & Works ({currentVendor.portfolioImages?.length || 0})</span>
                </button>

                <button
                  onClick={() => setVendorNav('inquiries')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap relative ${
                    vendorNav === 'inquiries'
                      ? 'bg-gold-500 text-stone-950 shadow-md shadow-gold-500/20'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>3. Client Inquiries</span>
                  {inquiries.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-gold-600 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                      {inquiries.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setVendorNav('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    vendorNav === 'profile'
                      ? 'bg-gold-500 text-stone-950 shadow-md shadow-gold-500/20'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>4. Edit Profile & Packages</span>
                </button>
              </>
            )}

          </div>

        </div>
      </section>

      {/* --------------------------------------------- */}
      {/* VENDOR APPROVAL STATUS BANNER (DASHBOARD)     */}
      {/* --------------------------------------------- */}
      {currentVendor && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {currentVendor.status === 'pending' ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Application Submitted — Pending Admin Verification
                  </h4>
                  <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
                    Your portfolio and business details have been sent to the AURA Curation team. The Administrator will review your work and approve it for the public directory. You can continue uploading photos and editing your packages in the meantime.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200/80 text-amber-900 border border-amber-400 whitespace-nowrap self-start sm:self-auto">
                Status: Pending Admin Approval
              </span>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Verified Creator — Published Live on Public Directory
                  </h4>
                  <p className="text-xs text-emerald-800/80 mt-0.5">
                    Your profile and portfolio are currently visible to clients and event organizers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenVendorProfile(currentVendor)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Listing</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* TAB 1: SELF-REGISTRATION FORM                 */}
      {/* --------------------------------------------- */}
      {vendorNav === 'register' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Registration Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              
              <div className="border-b border-stone-200 pb-5 mb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold-100 text-gold-900">
                    <span>Step 1 of 1</span> • <span>Admin Review Required</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRegName('Elegance Floral & Bespoke Decor');
                      setRegTagline('Luxury event architecture and floral design across Addis Ababa');
                      setRegBio('Specializing in high-end royal weddings, melse backdrops, and bespoke VIP lighting design with over 7 years of curated excellence.');
                      setRegLocation('Addis Ababa (Bole)');
                      setRegPhone('+251 91 144 8899');
                      setRegEmail('info@elegancedecor.et');
                      setRegUsername('elegance_decor');
                      setRegPassword('vendor123');
                      setRegStartingPrice('95,000 ETB');
                      setRegInstagram('@elegancedecor_et');
                      applyCategoryPreset(regCategory);
                      setRegErrors({});
                      setRegFormError('');
                      onShowToast('Filled sample business details & credentials!', 'info');
                    }}
                    className="text-xs font-semibold text-gold-700 hover:text-gold-900 bg-gold-50 hover:bg-gold-100 border border-gold-200 px-3 py-1 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Fill Sample Data</span>
                  </button>
                </div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Vendor Registration & Portfolio Submission
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Upload your photos directly from your phone/computer. Once submitted, the Admin team reviews your portfolio before making your profile public.
                </p>
              </div>

              <form noValidate onSubmit={handleRegisterVendor} className="space-y-8">
                
                {/* 1. Business Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 font-bold text-xs flex items-center justify-center">1</span>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Business & Category</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Business / Brand Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="regNameInput"
                        type="text"
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (regErrors.name) setRegErrors(prev => ({ ...prev, name: '' }));
                        }}
                        placeholder="e.g. Selam Couture Floral & Decor, Zemen Media"
                        className={`w-full px-3.5 py-2.5 bg-stone-50 border ${
                          regErrors.name ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-300'
                        } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition`}
                      />
                      {regErrors.name && (
                        <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {regErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={regCategory}
                        onChange={(e) => applyCategoryPreset(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      >
                        <option value="Decor">Decor & Styling</option>
                        <option value="Media">Media & Cinematography</option>
                        <option value="Catering">Catering & Pastry</option>
                        <option value="AV & Sound">AV, Sound & Lighting</option>
                        <option value="Venue">Venue & Ballrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Location / District</label>
                      <input
                        type="text"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        placeholder="e.g. Addis Ababa (Bole)"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={regTagline}
                        onChange={(e) => setRegTagline(e.target.value)}
                        placeholder="e.g. Couture floral arches, bespoke stages, and timeless memories."
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Creative Bio</label>
                      <textarea
                        rows={3}
                        value={regBio}
                        onChange={(e) => setRegBio(e.target.value)}
                        placeholder="Tell clients about your aesthetic, experience, and style..."
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Account Login Credentials */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 font-bold text-xs flex items-center justify-center">2</span>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Account Credentials (For Sign In)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Vendor Username <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="regUsernameInput"
                          type="text"
                          value={regUsername}
                          onChange={(e) => {
                            setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                            if (regErrors.username) setRegErrors(prev => ({ ...prev, username: '' }));
                          }}
                          placeholder="e.g. elegance_decor"
                          className={`w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border ${
                            regErrors.username ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-300'
                          } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition`}
                        />
                      </div>
                      {regErrors.username && (
                        <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {regErrors.username}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400 mt-1">Choose a unique username to sign into your vendor hub.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Account Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="regPasswordInput"
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => {
                            setRegPassword(e.target.value);
                            if (regErrors.password) setRegErrors(prev => ({ ...prev, password: '' }));
                          }}
                          placeholder="Minimum 4 characters (e.g. 4-digit PIN 1234 or password)"
                          className={`w-full pl-9 pr-10 py-2.5 bg-stone-50 border ${
                            regErrors.password ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-300'
                          } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {regErrors.password && (
                        <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {regErrors.password}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400 mt-1">Minimum 4 characters (e.g. 4-digit PIN 1234 or password)</p>
                    </div>
                  </div>
                </div>

                {/* 3. Contact Channels */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 font-bold text-xs flex items-center justify-center">3</span>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Contact & Social Channels</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="regPhoneInput"
                          type="text"
                          value={regPhone}
                          onChange={(e) => {
                            setRegPhone(e.target.value);
                            if (regErrors.phone) setRegErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          placeholder="+251 91 ..."
                          className={`w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border ${
                            regErrors.phone ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-300'
                          } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition`}
                        />
                      </div>
                      {regErrors.phone && (
                        <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {regErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Official Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="info@studio.et"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Instagram Handle</label>
                      <div className="relative">
                        <InstagramIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={regInstagram}
                          onChange={(e) => setRegInstagram(e.target.value)}
                          placeholder="@yourbrand"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Starting Price</label>
                      <input
                        type="text"
                        value={regStartingPrice}
                        onChange={(e) => setRegStartingPrice(e.target.value)}
                        placeholder="e.g. 85,000 ETB"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Photos & File Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 font-bold text-xs flex items-center justify-center">3</span>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                        Upload Photos from Computer
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyCategoryPreset(regCategory)}
                      className="text-xs text-gold-700 hover:text-gold-800 font-medium underline"
                    >
                      Fill sample {regCategory} photos
                    </button>
                  </div>

                  {/* Avatar & Cover with File Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    
                    {/* Avatar File */}
                    <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
                      <label className="block text-xs font-bold text-stone-800 mb-2">Avatar / Logo Image</label>
                      <div className="flex items-center gap-3">
                        {regAvatar ? (
                          <img src={regAvatar} alt="Avatar" className="w-14 h-14 rounded-xl object-cover ring-2 ring-stone-300 shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-gold-400" />
                            <span>Select from Computer</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSingleFileUpload(e.target.files[0], setRegAvatar)}
                            />
                          </label>
                          <p className="text-[11px] text-stone-400 mt-1">PNG, JPG, or WEBP</p>
                        </div>
                      </div>
                    </div>

                    {/* Cover File */}
                    <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
                      <label className="block text-xs font-bold text-stone-800 mb-2">Cover Showcase Banner</label>
                      <div className="flex items-center gap-3">
                        {regCover ? (
                          <img src={regCover} alt="Cover" className="w-20 h-14 rounded-xl object-cover ring-2 ring-stone-300 shrink-0" />
                        ) : (
                          <div className="w-20 h-14 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-gold-400" />
                            <span>Select from Computer</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSingleFileUpload(e.target.files[0], setRegCover)}
                            />
                          </label>
                          <p className="text-[11px] text-stone-400 mt-1">Wide landscape photo</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Portfolio Gallery Upload from Files */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-900">
                          Portfolio Works Showcase ({regPortfolioImages.length} photos)
                        </label>
                        <p className="text-[11px] text-stone-500">
                          Select photos directly from your computer to show clients your past events.
                        </p>
                      </div>

                      {/* File Selection Button (Multiple) */}
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white text-xs font-bold rounded-xl shadow-sm transition">
                        <Upload className="w-4 h-4" />
                        <span>Select Photos from Computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleMultipleFilesUpload(e.target.files, (dataUrl) => setRegPortfolioImages(prev => [...prev, dataUrl]))}
                        />
                      </label>
                    </div>

                    {/* Or URL input fallback */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="url"
                        value={newPortfolioUrl}
                        onChange={(e) => setNewPortfolioUrl(e.target.value)}
                        placeholder="Or paste an image link (https://...)"
                        className="flex-1 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      />
                      <button
                        type="button"
                        onClick={handleAddRegPortfolioImage}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition"
                      >
                        Add Link
                      </button>
                    </div>

                    {/* Thumbnails Preview Grid */}
                    {regPortfolioImages.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-stone-300 rounded-xl">
                        <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs text-stone-500">No portfolio photos selected yet.</p>
                        <p className="text-[11px] text-stone-400">Click "Select Photos from Computer" above.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {regPortfolioImages.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden aspect-4/3 bg-stone-200 border border-stone-300">
                            <img src={img} alt={`Work ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveRegPortfolioImage(idx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-stone-950/80 hover:bg-rose-600 text-white rounded-lg transition"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Submit Application */}
                <div className="pt-4 border-t border-stone-200">
                  {/* Inline Error Alert if submission cannot proceed */}
                  {regFormError && (
                    <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex items-start gap-3 shadow-xs">
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-rose-900">Registration Notice</p>
                        <p className="text-rose-700 mt-0.5 leading-relaxed">{regFormError}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    onClick={(e) => handleRegisterVendor(e)}
                    disabled={registering}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-700 to-amber-700 hover:from-gold-700 hover:to-amber-800 text-white font-semibold text-sm shadow-lg shadow-gold-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {registering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Application for Admin Review...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Submit Registration for Admin Approval</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-stone-500 mt-2">
                    Once submitted, our admin team will review your application before publishing your profile live.
                  </p>
                </div>

              </form>

            </div>

            {/* Right: Live Preview Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Live Directory Preview</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      Pending Admin
                    </span>
                  </div>

                  {/* Replica Card */}
                  <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xs">
                    <div className="h-32 bg-stone-900 relative">
                      <img
                        src={regCover || SAMPLE_PRESETS[regCategory]?.cover || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-85"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-950/80 text-white">
                        {regCategory}
                      </span>
                    </div>

                    <div className="p-4 relative pt-10">
                      <img
                        src={regAvatar || SAMPLE_PRESETS[regCategory]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt="Avatar"
                        className="w-14 h-14 rounded-2xl object-cover ring-3 ring-white absolute -top-7 left-4 shadow-sm"
                      />

                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-base">
                            {regName || 'Your Business Name'}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {regLocation || 'Addis Ababa, Ethiopia'}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                          {regPriceRange}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {regTagline || regBio || 'Elevating Ethiopian celebrations with creative distinction.'}
                      </p>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>Starting from</span>
                        <span className="font-bold text-stone-900">{regStartingPrice || '85,000 ETB'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Admin Approval Required:</strong> To protect event hosts from spam, all new creator registrations must be approved by the platform admin before appearing publicly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>
      )}

      {/* --------------------------------------------- */}
      {/* TAB 2: PORTFOLIO & FEED WORKS MANAGER         */}
      {/* --------------------------------------------- */}
      {vendorNav === 'portfolio' && currentVendor && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Direct Post Inspiration Form */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Post to Inspiration Feed */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">Post to Inspiration Feed</h3>
                      <p className="text-[11px] text-stone-500">Publish your work live to the public feed</p>
                    </div>
                  </div>
                </div>

                {currentVendor.status !== 'active' ? (
                  <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6 text-amber-700" />
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
                      🔒 Visual Publishing Locked — Awaiting Admin Verification
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto mb-4">
                      Your registered business profile is currently awaiting administrator review. Once the platform admin approves your listing in the Admin Portal, your access to publish visual works to the Inspiration Feed and expand your portfolio unlocks automatically.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-[11px] font-bold text-amber-900">
                        <Clock className="w-3.5 h-3.5 animate-spin text-amber-700" />
                        <span>Status: Awaiting Admin Approval</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckApprovalStatus}
                        disabled={refreshingStatus}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${refreshingStatus ? 'animate-spin' : ''}`} />
                        <span>{refreshingStatus ? 'Checking Status...' : 'Check Approval Status'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handlePostInspiration} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Title of Visual Work <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newInspTitle}
                          onChange={(e) => setNewInspTitle(e.target.value)}
                          placeholder="e.g. Glass Pavilion Stage at Skylight Hotel"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                        />
                      </div>

                      {/* Photo selection: File OR URL */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Photo (Select from Computer or Paste URL) <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newInspImage}
                            onChange={(e) => setNewInspImage(e.target.value)}
                            placeholder="Paste image link or choose file..."
                            className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                          />
                          <label className="cursor-pointer px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition">
                            <Upload className="w-3.5 h-3.5 text-gold-400" />
                            <span>Choose File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSingleFileUpload(e.target.files[0], setNewInspImage)}
                            />
                          </label>
                        </div>

                        {newInspImage && (
                          <div className="rounded-xl overflow-hidden aspect-16/9 max-h-44 bg-stone-100 border border-stone-200">
                            <img src={newInspImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                          <select
                            value={newInspCategory}
                            onChange={(e) => setNewInspCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
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
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Event Type</label>
                          <select
                            value={newInspEventType}
                            onChange={(e) => setNewInspEventType(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                          >
                            <option value="Modern Wedding">Modern Wedding</option>
                            <option value="Traditional Melse">Traditional Melse</option>
                            <option value="Corporate Gala">Corporate Gala</option>
                            <option value="Private Celebration">Private Celebration</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Palette Colors (Hex, Comma Separated)</label>
                        <input
                          type="text"
                          value={newInspPalette}
                          onChange={(e) => setNewInspPalette(e.target.value)}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Tags (Comma Separated)</label>
                        <input
                          type="text"
                          value={newInspTags}
                          onChange={(e) => setNewInspTags(e.target.value)}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Work Description</label>
                        <textarea
                          rows={2}
                          value={newInspDesc}
                          onChange={(e) => setNewInspDesc(e.target.value)}
                          placeholder="Describe the styling, venue context, lighting, or materials..."
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingInsp}
                        className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                      >
                        {submittingInsp ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Publishing Visual to Feed...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish to Inspiration Feed</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Quick Add directly to Portfolio Showcase */}
                    <div className="pt-5 border-t border-stone-100">
                      <h4 className="text-xs font-bold text-stone-900 mb-1">Add to Portfolio Showcase Gallery</h4>
                      <p className="text-[11px] text-stone-500 mb-3">Upload client-facing gallery photo without publishing to feed.</p>

                      <label className="cursor-pointer w-full py-2.5 px-4 mb-3 rounded-xl border border-dashed border-stone-300 hover:border-gold-500 bg-stone-50 hover:bg-gold-50/40 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition">
                        <Upload className="w-4 h-4 text-gold-600" />
                        <span>Upload Photo from Computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImageFile(file, 1280, 1280, 0.82);
                                if (compressed) handleAddDirectPortfolioPhoto(compressed);
                              } catch (err) {
                                console.error('Direct photo compression failed:', err);
                              }
                            }
                          }}
                        />
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={directAddPhotoUrl}
                          onChange={(e) => setDirectAddPhotoUrl(e.target.value)}
                          placeholder="Or paste photo link..."
                          className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          disabled={addingPhoto}
                          onClick={() => handleAddDirectPortfolioPhoto(directAddPhotoUrl)}
                          className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Portfolio Showcase Gallery & Feed Works */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Portfolio Showcase */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      Your Profile Portfolio Showcase ({currentVendor.portfolioImages?.length || 0})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Images displayed in your public modal gallery
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenVendorProfile(currentVendor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>

                {(!currentVendor.portfolioImages || currentVendor.portfolioImages.length === 0) ? (
                  <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-2xl">
                    <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500">No portfolio photos added yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentVendor.portfolioImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200 shadow-xs">
                        <img src={img} alt={`Work ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button
                            onClick={() => handleRemovePortfolioPhoto(img)}
                            className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Published Feed Works */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    Published Live Feed Works ({vendorInspirations.length})
                  </h3>
                </div>

                {loadingInspirations ? (
                  <div className="text-center py-10 text-xs text-stone-400">Loading works...</div>
                ) : vendorInspirations.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-2xl">
                    <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500">You haven't posted any works to the public feed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vendorInspirations.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50"
                      >
                        <div className="flex items-center gap-3.5">
                          <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-xl object-cover ring-1 ring-stone-200" />
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                            <span className="text-[11px] text-stone-500">{item.category} • {item.eventType}</span>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                              <span><Heart className="w-3 h-3 text-rose-500 inline mr-0.5" />{item.likesCount || 0}</span>
                              <span><Eye className="w-3 h-3 inline mr-0.5" />{item.viewsCount || 0}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteInspiration(item._id)}
                          className="p-2 text-stone-400 hover:text-rose-600 rounded-xl"
                          title="Delete from feed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </section>
      )}

      {/* --------------------------------------------- */}
      {/* TAB 3: CLIENT INQUIRIES & LEADS               */}
      {/* --------------------------------------------- */}
      {vendorNav === 'inquiries' && currentVendor && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">
              Client Inquiries ({inquiries.length})
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Direct quote requests sent specifically to {currentVendor.name}
            </p>

            {loadingInquiries ? (
              <div className="text-center py-10 text-xs text-stone-400">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500">No client inquiries received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{inq.clientName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                            {inq.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-600">
                          <span>📞 {inq.clientPhone}</span>
                          <span>✉️ {inq.clientEmail}</span>
                          <span>🎉 {inq.eventType}</span>
                        </div>
                        <p className="text-xs text-stone-700 mt-2 p-3 bg-white rounded-xl border border-stone-200">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold"
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
        </section>
      )}

      {/* --------------------------------------------- */}
      {/* TAB 4: EDIT PROFILE & PACKAGES                */}
      {/* --------------------------------------------- */}
      {vendorNav === 'profile' && currentVendor && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">Edit Business Details</h2>
            <p className="text-xs text-stone-500 mb-6">Keep your contact details and pricing up-to-date</p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={editProfile.name || ''}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Starting Price</label>
                  <input
                    type="text"
                    value={editProfile.startingPrice || ''}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, startingPrice: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editProfile.contactPhone || ''}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editProfile.contactEmail || ''}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editProfile.tagline || ''}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={editProfile.bio || ''}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-sm transition"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* --------------------------------------------- */}
      {/* RETURNING VENDOR SIGN-IN MODAL                */}
      {/* --------------------------------------------- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowLoginModal(false);
                setSignInMode('password');
                setForgotStep(1);
              }}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-xl"
            >
              ✕
            </button>

            {/* Header / Mode Indicator */}
            {signInMode === 'forgot' ? (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setSignInMode('password');
                    setForgotStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-3 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Password Recovery
                </h3>
                <p className="text-stone-500 text-xs mt-1">
                  {forgotStep === 1
                    ? 'Enter your registered username, phone, or email to reset your credentials.'
                    : 'Set a new 4+ character password for your business profile.'}
                </p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Vendor Sign In
                </h3>
                <p className="text-stone-500 text-xs mt-1">
                  Access your vendor dashboard, leads, and portfolio works.
                </p>

                {/* Sign-In Mode Switcher Tabs */}
                <div className="flex rounded-xl bg-stone-100 p-1 mt-4 gap-1">
                  <button
                    type="button"
                    onClick={() => setSignInMode('password')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      signInMode === 'password'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5 text-gold-600" />
                    <span>Password / PIN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignInMode('otp')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      signInMode === 'otp'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-gold-600" />
                    <span>Phone OTP</span>
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------- */}
            {/* MODE 1: PASSWORD / PIN SIGN IN                */}
            {/* --------------------------------------------- */}
            {signInMode === 'password' && (
              <form onSubmit={handleVendorLogin} className="space-y-4">
                {lockoutRemaining > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs shadow-xs">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Security Lockout Active</span>
                    </div>
                    <p className="text-rose-700 leading-relaxed text-[11px] mb-2">
                      5 failed attempts detected. Account temporarily locked for security (<strong className="font-mono">{lockoutRemaining}s</strong> remaining).
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSignInMode('otp');
                          if (loginIdentifier.match(/\d/)) setOtpPhone(loginIdentifier);
                        }}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition"
                      >
                        Use Phone OTP Instead
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInMode('forgot');
                          setForgotIdentifier(loginIdentifier);
                          setForgotStep(1);
                        }}
                        className="flex-1 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-semibold transition"
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Username, Phone, or Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. aura-luxury-decor or info@studio.et"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      Password / PIN <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInMode('forgot');
                        setForgotIdentifier(loginIdentifier);
                        setForgotStep(1);
                      }}
                      className="text-[11px] font-semibold text-gold-700 hover:text-gold-900 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter 4+ char password or PIN"
                      className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">Min 4 characters (e.g. 1234)</p>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading || lockoutRemaining > 0}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-gold-400" />
                      <span>Sign In to Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* --------------------------------------------- */}
            {/* MODE 2: PHONE OTP ALTERNATE SIGN IN           */}
            {/* --------------------------------------------- */}
            {signInMode === 'otp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Registered Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="+251 91 123 4567 or 0911234567"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    disabled={otpLoading || !otpPhone.trim()}
                    onClick={handleSendOtp}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {otpLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 text-gold-400" />
                        <span>Send 4-Digit Passcode</span>
                      </>
                    )}
                  </button>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {otpDemoCode && (
                      <div className="p-2.5 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-between text-xs">
                        <span className="text-gold-900 font-medium">Demo SMS Code: <strong className="font-mono tracking-widest">{otpDemoCode}</strong></span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(otpDemoCode)}
                          className="text-[11px] font-bold text-gold-700 hover:text-gold-900 underline"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Enter 4-Digit Passcode <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="e.g. 4829"
                        className="w-full py-2.5 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-center text-lg font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="px-3 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-semibold"
                      >
                        Resend
                      </button>
                      <button
                        type="submit"
                        disabled={otpLoading || !otpCode.trim()}
                        className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
                      >
                        {otpLoading ? 'Verifying...' : 'Verify & Sign In'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* --------------------------------------------- */}
            {/* MODE 3: FORGOT PASSWORD RECOVERY              */}
            {/* --------------------------------------------- */}
            {signInMode === 'forgot' && (
              <div className="space-y-4">
                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotLookup} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Username, Registered Phone, or Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          placeholder="e.g. aura-luxury-decor or +251 91..."
                          className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {forgotLoading ? 'Locating Account...' : 'Locate My Account'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold">Account Verified: {forgotVendorName}</p>
                          <p className="text-[11px] text-emerald-700">Enter your new 4+ character password below.</p>
                        </div>
                      </div>
                      {forgotDemoOtp && (
                        <div className="text-right shrink-0 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                          <span className="text-[9px] text-emerald-700 uppercase font-semibold block">Recovery Code</span>
                          <span className="font-mono font-bold text-xs tracking-widest text-emerald-950">{forgotDemoOtp}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        New Password / PIN <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showForgotNewPassword ? 'text' : 'password'}
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="Min 4 characters (e.g. 1234)"
                          className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                        >
                          {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      {forgotLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick 1-Click Test Credentials Section */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  1-Click Fill Test Account:
                </p>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                  Default PIN: vendor123
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {vendors.slice(0, 6).map(v => {
                  const uname = v.username || v.slug || v.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  return (
                    <button
                      key={v._id}
                      type="button"
                      onClick={() => {
                        if (signInMode === 'otp') {
                          setOtpPhone(v.contactPhone || '+251 91 123 4567');
                          onShowToast(`Filled phone for ${v.name}: ${v.contactPhone}`, 'info');
                        } else if (signInMode === 'forgot') {
                          setForgotIdentifier(uname);
                          onShowToast(`Filled identifier for ${v.name}`, 'info');
                        } else {
                          setLoginIdentifier(uname);
                          setLoginPassword('vendor123');
                          onShowToast(`Filled credentials for ${v.name} (password: vendor123)`, 'info');
                        }
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-stone-100 transition border border-stone-100 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={v.avatar} alt={v.name} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-stone-800 truncate">{v.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono truncate">@{uname} • {v.contactPhone || 'No phone'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gold-700 font-semibold shrink-0 group-hover:underline">Fill & Test</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
