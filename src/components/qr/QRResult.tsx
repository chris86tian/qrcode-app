import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy, Sparkles, Grid3X3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QRFormData, ContentType, QRStyle } from '../../types/qr';

interface QRResultProps {
  qrCodeUrl: string;
  formData: QRFormData;
  contentType: ContentType;
  qrStyle?: QRStyle;
}

const QRResult: React.FC<QRResultProps> = ({ qrCodeUrl, formData, contentType, qrStyle = 'classic' }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${qrStyle}-${contentType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR-Code heruntergeladen!');
  };

  const handleCopyImage = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      toast.success('QR-Code in Zwischenablage kopiert!');
    } catch (error) {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${qrStyle}-${contentType}.png`, { type: blob.type });
        
        await navigator.share({
          title: 'Mein QR-Code',
          text: `QR-Code für ${contentType} im ${qrStyle} Stil`,
          files: [file]
        });
      } catch (error) {
        toast.error('Teilen fehlgeschlagen');
      }
    } else {
      toast.error('Teilen wird von diesem Browser nicht unterstützt');
    }
  };

  const getStyleInfo = () => {
    switch (qrStyle) {
      case 'glassmorphism-dots':
        return {
          emoji: '✨',
          name: 'Glassmorphism Dots',
          description: 'Transparente Punkte mit Blur-Effekt',
          bgClass: 'qr-result-glass'
        };
      case 'pixel-perfect':
        return {
          emoji: '🎮',
          name: 'Pixel Perfect',
          description: 'Retro-Gaming inspirierte Quadrate',
          bgClass: 'qr-result-pixel'
        };
      default:
        return {
          emoji: '📱',
          name: 'Klassisch',
          description: 'Standard QR-Code Design',
          bgClass: 'qr-result-container'
        };
    }
  };

  const styleInfo = getStyleInfo();
  const isTransparent = formData.transparent;
  const qrClasses = isTransparent ? 'transparency-bg' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      className={`${styleInfo.bgClass} rounded-3xl p-8 shadow-2xl`}
    >
      <div className="text-center space-y-6">
        <motion.h2 
          className="text-2xl font-bold gradient-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {styleInfo.emoji} Ihr QR-Code ist fertig!
        </motion.h2>

        {/* Style Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {qrStyle === 'glassmorphism-dots' && <Sparkles className="w-4 h-4" />}
          {qrStyle === 'pixel-perfect' && <Grid3X3 className="w-4 h-4" />}
          <span className="text-sm font-medium">{styleInfo.name}</span>
        </motion.div>

        {/* QR Code Display */}
        <motion.div
          className="inline-block p-4 bg-white rounded-2xl shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`p-2 rounded-xl ${qrClasses}`}>
            <img
              src={qrCodeUrl}
              alt={`QR-Code für ${contentType} im ${styleInfo.name} Stil`}
              className="max-w-xs w-full h-auto rounded-lg"
              style={{
                backgroundColor: isTransparent ? 'transparent' : formData.lightColor,
                filter: qrStyle === 'glassmorphism-dots' ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none'
              }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Download PNG
          </motion.button>

          <motion.button
            onClick={handleCopyImage}
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-5 h-5" />
            Kopieren
          </motion.button>

          {navigator.share && (
            <motion.button
              onClick={handleShare}
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
              Teilen
            </motion.button>
          )}
        </motion.div>

        {/* QR Code Info */}
        <motion.div
          className="text-sm text-gray-600 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            <strong>Typ:</strong> {contentType.toUpperCase()} • <strong>Stil:</strong> {styleInfo.name}
          </p>
          <p className="text-blue-600 font-medium">
            {styleInfo.description}
          </p>
          {isTransparent && (
            <p className="text-purple-600">
              ✨ Transparenter Hintergrund - perfekt für verschiedene Untergründe
            </p>
          )}
          <p className="text-xs text-gray-500">
            Tipp: Testen Sie Ihren QR-Code mit verschiedenen Geräten und Apps
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QRResult;
