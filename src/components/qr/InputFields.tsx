import React from 'react';
import { motion } from 'framer-motion';
import { ContentType, QRFormData } from '../../types/qr';

interface InputFieldsProps {
  contentType: ContentType;
  formData: QRFormData;
  onFormDataChange: (updates: Partial<QRFormData>) => void;
}

const InputFields: React.FC<InputFieldsProps> = ({
  contentType,
  formData,
  onFormDataChange,
}) => {
  const handleInputChange = (field: keyof QRFormData, value: string | boolean) => {
    onFormDataChange({ [field]: value });
  };

  const renderFields = () => {
    switch (contentType) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://beispiel.com"
                className="input-primary"
                required
              />
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vorname
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nachname *
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="input-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisation
              </label>
              <input
                type="text"
                value={formData.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon (Arbeit)
              </label>
              <input
                type="tel"
                value={formData.phoneWork || ''}
                onChange={(e) => handleInputChange('phoneWork', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon (Mobil)
              </label>
              <input
                type="tel"
                value={formData.phoneMobile || ''}
                onChange={(e) => handleInputChange('phoneMobile', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webseite
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://beispiel.com"
                className="input-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Straße & Hausnummer
              </label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PLZ
              </label>
              <input
                type="text"
                value={formData.zip || ''}
                onChange={(e) => handleInputChange('zip', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stadt
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="input-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land
              </label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="input-primary"
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Netzwerkname (SSID) *
              </label>
              <input
                type="text"
                value={formData.wifi_ssid || ''}
                onChange={(e) => handleInputChange('wifi_ssid', e.target.value)}
                className="input-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={formData.wifi_password || ''}
                onChange={(e) => handleInputChange('wifi_password', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verschlüsselung
              </label>
              <select
                value={formData.wifi_encryption || 'WPA'}
                onChange={(e) => handleInputChange('wifi_encryption', e.target.value)}
                className="input-primary"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Keine Verschlüsselung</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="wifi_hidden"
                checked={formData.wifi_hidden || false}
                onChange={(e) => handleInputChange('wifi_hidden', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="wifi_hidden" className="text-sm font-medium text-gray-700">
                Netzwerk ist versteckt
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text *
            </label>
            <textarea
              value={formData.text || ''}
              onChange={(e) => handleInputChange('text', e.target.value)}
              rows={4}
              className="input-primary resize-none"
              required
            />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empfänger E-Mail *
              </label>
              <input
                type="email"
                value={formData.email_address || ''}
                onChange={(e) => handleInputChange('email_address', e.target.value)}
                className="input-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betreff
              </label>
              <input
                type="text"
                value={formData.email_subject || ''}
                onChange={(e) => handleInputChange('email_subject', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nachricht
              </label>
              <textarea
                value={formData.email_body || ''}
                onChange={(e) => handleInputChange('email_body', e.target.value)}
                rows={3}
                className="input-primary resize-none"
              />
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefonnummer *
              </label>
              <input
                type="tel"
                value={formData.sms_number || ''}
                onChange={(e) => handleInputChange('sms_number', e.target.value)}
                placeholder="+49123456789"
                className="input-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nachricht
              </label>
              <textarea
                value={formData.sms_body || ''}
                onChange={(e) => handleInputChange('sms_body', e.target.value)}
                rows={3}
                className="input-primary resize-none"
              />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Nummer *
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number || ''}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                placeholder="49123456789"
                className="input-primary"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Internationale Vorwahl ohne '+' oder '00'. Beispiel: 49 für Deutschland.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nachricht (optional)
              </label>
              <textarea
                value={formData.whatsapp_message || ''}
                onChange={(e) => handleInputChange('whatsapp_message', e.target.value)}
                rows={3}
                className="input-primary resize-none"
              />
            </div>
          </div>
        );

      case 'spotify':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spotify URL *
            </label>
            <input
              type="url"
              value={formData.spotify_url || ''}
              onChange={(e) => handleInputChange('spotify_url', e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="input-primary"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Link zu Song, Album, Playlist oder Künstler.
            </p>
          </div>
        );

      case 'youtube':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL *
            </label>
            <input
              type="url"
              value={formData.youtube_url || ''}
              onChange={(e) => handleInputChange('youtube_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-primary"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Link zu Video, Kanal oder Playlist.
            </p>
          </div>
        );

      case 'bewertung':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bewertungs-URL *
            </label>
            <input
              type="url"
              value={formData.review_url || ''}
              onChange={(e) => handleInputChange('review_url', e.target.value)}
              placeholder="https://g.page/r/..."
              className="input-primary"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Link zu Ihrer Bewertungsseite (z.B. Google, Yelp).
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Bitte wählen Sie einen Inhaltstyp aus.
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Inhalte eingeben
      </h3>
      {renderFields()}
    </motion.div>
  );
};

export default InputFields;
