import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ContentTypeSelector from './ContentTypeSelector';
import InputFields from './InputFields';
import ColorControls from './ColorControls';
import StyleSelector from './StyleSelector';
import LogoUpload from './LogoUpload';
import QRResult from './QRResult';
import DonationModal from '../donation/DonationModal';
import { QRFormData, ContentType, QRStyle } from '../../types/qr';
import { generateQRCode } from '../../services/qrService';

const QRGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>('url');
  const [qrStyle, setQrStyle] = useState<QRStyle>('classic');
  const [formData, setFormData] = useState<QRFormData>({
    content_type: 'url',
    darkColor: '#000000',
    lightColor: '#FFFFFF',
    transparent: false,
    whiteQrMode: 'invert-colors',
    qrStyle: 'classic',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleContentTypeChange = useCallback((type: ContentType) => {
    setContentType(type);
    setFormData(prev => ({ ...prev, content_type: type }));
  }, []);

  const handleStyleChange = useCallback((style: QRStyle) => {
    setQrStyle(style);
    setFormData(prev => ({ ...prev, qrStyle: style }));
  }, []);

  const handleFormDataChange = useCallback((updates: Partial<QRFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleLogoChange = useCallback((file: File | null) => {
    setLogo(file);
  }, []);

  const scrollToQRResult = () => {
    const qrResultElement = document.getElementById('qr-result');
    if (qrResultElement) {
      qrResultElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const handleDonationClose = () => {
    setShowDonationModal(false);
    // Scroll to QR result after closing donation modal
    setTimeout(() => {
      scrollToQRResult();
    }, 300);
  };

  const handleGenerate = async () => {
    if (!contentType) {
      toast.error('Bitte wählen Sie einen Inhaltstyp aus.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await generateQRCode(formData, logo);
      setQrResult(result.qrCodeUrl);
      toast.success(`QR-Code im ${qrStyle === 'glassmorphism-dots' ? 'Glassmorphism' : qrStyle === 'pixel-perfect' ? 'Pixel Perfect' : 'klassischen'} Stil erfolgreich generiert! ✨`);
      
      // Show donation modal immediately after successful generation
      setTimeout(() => {
        setShowDonationModal(true);
      }, 500); // Small delay to let the QR result render first
      
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler beim Generieren des QR-Codes');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Generator Card */}
      <motion.div
        className="glass rounded-3xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          {/* Content Type Selector */}
          <ContentTypeSelector
            selectedType={contentType}
            onTypeChange={handleContentTypeChange}
          />

          {/* Input Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={contentType}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InputFields
                contentType={contentType}
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />
            </motion.div>
          </AnimatePresence>

          {/* Style Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StyleSelector
              selectedStyle={qrStyle}
              onStyleChange={handleStyleChange}
            />
          </motion.div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ColorControls
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
            <LogoUpload
              logo={logo}
              onLogoChange={handleLogoChange}
            />
            <div className="flex items-end">
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary w-full h-14 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="spinner" />
                    Generiere...
                  </div>
                ) : (
                  <>
                    {qrStyle === 'glassmorphism-dots' && '✨ '}
                    {qrStyle === 'pixel-perfect' && '🎮 '}
                    QR-Code generieren
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Result */}
      <AnimatePresence>
        {qrResult && (
          <div id="qr-result">
            <QRResult
              qrCodeUrl={qrResult}
              formData={formData}
              contentType={contentType}
              qrStyle={qrStyle}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={handleDonationClose}
      />
    </div>
  );
};

export default QRGenerator;
