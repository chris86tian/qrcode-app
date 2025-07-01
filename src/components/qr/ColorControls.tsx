import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, EyeOff } from 'lucide-react';
import { QRFormData } from '../../types/qr';

interface ColorControlsProps {
  formData: QRFormData;
  onFormDataChange: (updates: Partial<QRFormData>) => void;
}

const ColorControls: React.FC<ColorControlsProps> = ({
  formData,
  onFormDataChange,
}) => {
  const isWhiteOrLight = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200;
  };

  const isDarkColorWhite = isWhiteOrLight(formData.darkColor);
  const showWhiteQrOptions = formData.transparent && isDarkColorWhite;

  const whiteQrModes = [
    { value: 'invert-colors', label: '🔄 Farben umkehren', desc: 'Empfohlen' },
    { value: 'dark-background', label: '🌙 Dunkler Hintergrund', desc: 'Weiß auf dunkel' },
    { value: 'outlined', label: '⭕ Schwarzer Rahmen', desc: 'Mit Outline-Effekt' },
    { value: 'with-border', label: '🖼️ Mit Rahmen', desc: 'Schwarzer Rahmen' },
    { value: 'force-transparent', label: '⚠️ Trotzdem transparent', desc: 'Möglicherweise unsichtbar' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Farben & Stil</h3>
      </div>

      {/* Dark Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Farbe (Punkte)
        </label>
        <div className="relative">
          <input
            type="color"
            value={formData.darkColor}
            onChange={(e) => onFormDataChange({ darkColor: e.target.value })}
            className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
          />
          <div className="absolute inset-0 rounded-xl border-2 border-gray-200 pointer-events-none" />
        </div>
      </div>

      {/* Light Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Farbe (Hintergrund)
        </label>
        <div className="relative">
          <input
            type="color"
            value={formData.lightColor}
            onChange={(e) => onFormDataChange({ lightColor: e.target.value })}
            disabled={formData.transparent}
            className={`w-full h-12 rounded-xl border border-gray-200 cursor-pointer ${
              formData.transparent ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <div className="absolute inset-0 rounded-xl border-2 border-gray-200 pointer-events-none" />
        </div>
      </div>

      {/* Transparency Toggle */}
      <div className="space-y-3">
        <motion.button
          type="button"
          onClick={() => onFormDataChange({ transparent: !formData.transparent })}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
            formData.transparent
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            {formData.transparent ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            <span className="font-medium">
              {formData.transparent ? 'Transparent' : 'Opak'}
            </span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            formData.transparent ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
          }`}>
            {formData.transparent && (
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        </motion.button>

        {formData.transparent && (
          <p className="text-xs text-gray-500 px-2">
            Transparenter Hintergrund ideal für verschiedene Untergründe
          </p>
        )}
      </div>

      {/* White QR Code Options */}
      {showWhiteQrOptions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
        >
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-lg">⚠️</span>
            <h4 className="font-semibold">Weißer QR-Code erkannt</h4>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Weiße QR-Codes sind auf transparentem Hintergrund unsichtbar. Wählen Sie eine Alternative:
          </p>
          
          <div className="space-y-2">
            {whiteQrModes.map((mode) => (
              <label
                key={mode.value}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
              >
                <input
                  type="radio"
                  name="whiteQrMode"
                  value={mode.value}
                  checked={formData.whiteQrMode === mode.value}
                  onChange={(e) => onFormDataChange({ whiteQrMode: e.target.value as any })}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">
                    {mode.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {mode.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ColorControls;
