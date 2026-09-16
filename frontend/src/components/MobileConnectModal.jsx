import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import axios from 'axios';
import { 
  X, 
  Smartphone, 
  Wifi, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  QrCode,
  Share2,
  RefreshCw
} from 'lucide-react';
import { API_BASE } from '../config/api';

export default function MobileConnectModal({ isOpen, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [mobileUrl, setMobileUrl] = useState('');
  const [lanIp, setLanIp] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    // 1. Determine the host URL
    const detectMobileUrl = async () => {
      let targetUrl = '';
      try {
        const res = await axios.get(`${API_BASE}/network-info`, { timeout: 3000 });
        if (res.data && res.data.mobileUrl) {
          targetUrl = res.data.mobileUrl;
          if (isMounted) setLanIp(res.data.ip);
        }
      } catch (err) {
        console.log('Network info fallback to window location:', err.message);
      }

      // Fallback: use current window location or detected IP
      if (!targetUrl) {
        const hostname = window.location.hostname;
        const port = window.location.port || '5173';
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          // Default to Wi-Fi IP detected or fallback
          targetUrl = `http://192.168.1.6:${port}`;
        } else {
          targetUrl = `${window.location.protocol}//${hostname}:${port}`;
        }
      }

      if (isMounted) {
        setMobileUrl(targetUrl);
        try {
          const qr = await QRCode.toDataURL(targetUrl, {
            width: 320,
            margin: 2,
            color: {
              dark: '#1c1917', // stone-900
              light: '#ffffff'
            }
          });
          setQrDataUrl(qr);
        } catch (e) {
          console.error('QR code generation error:', e);
        }
        setLoading(false);
      }
    };

    detectMobileUrl();

    // Keydown escape to close
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!mobileUrl) return;
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-modal-title"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 dark:border-stone-800 my-6 overflow-hidden text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close mobile connect modal"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-gold-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 text-[11px] font-bold border border-gold-300/40 dark:border-gold-700/40">
              <Wifi className="w-3 h-3 text-gold-700 dark:text-gold-400" />
              <span>Mobile Phone Access & QR</span>
            </div>
            <h3 id="mobile-modal-title" className="font-serif text-2xl font-bold text-stone-900 dark:text-white mt-0.5">
              Open on Your Mobile Phone
            </h3>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-gradient-to-b from-stone-50 to-stone-100/80 dark:from-stone-950 dark:to-stone-800/80 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 text-center mb-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-stone-500 dark:text-stone-400">
              <RefreshCw className="w-8 h-8 text-gold-600 dark:text-gold-400 animate-spin mb-3" />
              <p className="text-xs font-semibold">Generating live Wi-Fi QR code...</p>
            </div>
          ) : qrDataUrl ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-stone-200 inline-block mb-3">
                <img 
                  src={qrDataUrl} 
                  alt={`QR code for ${mobileUrl}`} 
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
                />
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                Point your mobile phone camera at this QR code to open instantly
              </p>
            </div>
          ) : (
            <div className="py-8 text-stone-500 dark:text-stone-400 text-xs">
              Unable to generate QR code. Use the URL below directly.
            </div>
          )}

          {/* URL Box & One-Click Copy */}
          <div className="mt-4 flex items-center gap-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 p-2 shadow-xs">
            <input
              type="text"
              readOnly
              value={mobileUrl}
              className="flex-1 bg-transparent text-xs sm:text-sm font-mono text-stone-800 dark:text-stone-200 px-2 outline-none select-all"
              aria-label="Mobile access web address"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white'
              }`}
              aria-label="Copy mobile address link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Quick 3-Step Setup
          </h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-stone-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p className="text-stone-700 dark:text-stone-300">
                Ensure your phone is connected to the <strong>same Wi-Fi network</strong> as this computer ({lanIp ? `IP: ${lanIp}` : 'Local Wi-Fi'}).
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-stone-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p className="text-stone-700 dark:text-stone-300">
                Scan the QR code with your iPhone Camera or Android Google Lens / QR Scanner.
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700">
              <span className="w-5 h-5 rounded-full bg-gold-500 text-stone-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p className="text-stone-700 dark:text-stone-300">
                Tap <strong>"Share &gt; Add to Home Screen"</strong> on Safari/Chrome to run it as a full-screen mobile app!
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Features Checklist */}
        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Vite 0.0.0.0 Host & Proxy Active
          </span>
          <span className="flex items-center gap-1 text-gold-700 dark:text-gold-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Touch & Safe-Area Optimized
          </span>
        </div>

      </div>
    </div>
  );
}
