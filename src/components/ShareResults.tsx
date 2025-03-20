import React, { useState } from 'react';
import { Share2, Check, Copy, Mail, Facebook, Linkedin, Send } from 'lucide-react';

// Helper to detect iOS Safari
const isIOSSafari = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !/(CriOS|FxiOS|OPiOS|mercury)/i.test(ua) && /Safari/.test(ua);
};

// Helper to detect if Web Share API is fully supported
const isWebShareSupported = () => {
  return navigator.share && navigator.canShare && navigator.canShare({ url: 'https://example.com' });
};

interface ShareResultsProps {
  title: string;
  url: string;
  onShare?: () => void;
}

export function ShareResults({ title, url, onShare }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Prepare share data
  const shareData = {
    title,
    url,
    text: title // Fallback text for platforms that don't support title
  };
  
  const handleNativeShare = async () => {
    // Check if Web Share API is supported and can share our data
    if (isWebShareSupported() && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        if (onShare) onShare();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShowOptions(true);
        }
      }
    } else if (isIOSSafari()) {
      // Special handling for iOS Safari
      handleSocialShare('whatsapp', true);
    } else {
      setShowOptions(true);
    }
  };
  
  const handleSocialShare = (platform: string, isNative = false) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        // Use whatsapp:// protocol for native iOS sharing
        shareUrl = isNative && isIOSSafari()
          ? `whatsapp://send?text=${encodeURIComponent(title + ' ' + url)}`
          : `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      if (isNative) {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
      if (onShare) onShare();
    }
  };
  
  const handleCopyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } finally {
          document.body.removeChild(textArea);
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onShare) onShare();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="gradient-button text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Share your results</span>
          </>
        )}
      </button>
      
      {/* Share Options Popup */}
      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowOptions(false)}
          />
          
          {/* Share Modal */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-white rounded-xl shadow-lg p-4 z-50">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share with others</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* Facebook */}
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                  <Facebook className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              
              {/* Twitter */}
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
              
              {/* LinkedIn */}
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                  <Linkedin className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">LinkedIn</span>
              </button>
              
              {/* Email */}
              <button
                onClick={() => handleSocialShare('email')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">Email</span>
              </button>
            </div>
            
            {/* Copy Link Button */}
            <button
              onClick={handleCopyToClipboard}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Copy link</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}