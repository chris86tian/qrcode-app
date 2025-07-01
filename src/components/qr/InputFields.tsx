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
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                id="url"
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
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Vorname
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Nachname *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="input-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organisation
              </label>
              <input
                type="text"
                id="organization"
                value={formData.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                id="position"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="phoneWork" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon (Arbeit)
              </label>
              <input
                type="tel"
                id="phoneWork"
                value={formData.phoneWork || ''}
                onChange={(e) => handleInputChange('phoneWork', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="phoneMobile" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon (Mobil)
              </label>
              <input
                type="tel"
                id="phoneMobile"
                value={formData.phoneMobile || ''}
                onChange={(e) => handleInputChange('phoneMobile', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Webseite
              </label>
              <input
                type="url"
                id="website"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://beispiel.com"
                className="input-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Straße & Hausnummer
              </label>
              <input
                type="text"
                id="street"
                value={formData.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                PLZ
              </label>
              <input
                type="text"
                id="zip"
                value={formData.zip || ''}
                onChange={(e) => handleInputChange('zip', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Stadt
              </label>
              <input
                type="text"
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="input-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Land
              </label>
              <input
                type="text"
                id="country"
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
              <label htmlFor="wifi_ssid" className="block text-sm font-medium text-gray-700 mb-2">
                Netzwerkname (SSID) *
              </label>
              <input
                type="text"
                id="wifi_ssid"
                value={formData.wifi_ssid || ''}
                onChange={(e) => handleInputChange('wifi_ssid', e.target.value)}
                className="input-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="wifi_password" className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <input
                type="password"
                id="wifi_password"
                value={formData.wifi_password || ''}
                onChange={(e) => handleInputChange('wifi_password', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="wifi_encryption" className="block text-sm font-medium text-gray-700 mb-2">
                Verschlüsselung
              </label>
              <select
                id="wifi_encryption"
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
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Text *
            </label>
            <textarea
              id="text"
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
              <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-2">
                Empfänger E-Mail *
              </label>
              <input
                type="email"
                id="email_address"
                value={formData.email_address || ''}
                onChange={(e) => handleInputChange('email_address', e.target.value)}
                className="input-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="email_subject" className="block text-sm font-medium text-gray-700 mb-2">
                Betreff
              </label>
              <input
                type="text"
                id="email_subject"
                value={formData.email_subject || ''}
                onChange={(e) => handleInputChange('email_subject', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label htmlFor="email_body" className="block text-sm font-medium text-gray-700 mb-2">
                Nachricht
              </label>
              <textarea
                id="email_body"
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
              <label htmlFor="sms_number" className="block text-sm font-medium text-gray-700 mb-2">
                Telefonnummer *
              </label>
              <input
                type="tel"
                id="sms_number"
                value={formData.sms_number || ''}
                onChange={(e) => handleInputChange('sms_number', e.target.value)}
                placeholder="+49123456789"
                className="input-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="sms_body" className="block text-sm font-medium text-gray-700 mb-2">
                Nachricht
              </label>
              <textarea
                id="sms_body"
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
              <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Nummer *
              </label>
              <input
                type="tel"
                id="whatsapp_number"
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
              <label htmlFor="whatsapp_message" className="block text-sm font-medium text-gray-700 mb-2">
                Nachricht (optional)
              </label>
              <textarea
                id="whatsapp_message"
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
            <label htmlFor="spotify_url" className="block text-sm font-medium text-gray-700 mb-2">
              Spotify URL *
            </label>
            <input
              type="url"
              id="spotify_url"
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
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL *
            </label>
            <input
              type="url"
              id="youtube_url"
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
            <label htmlFor="review_url" className="block text-sm font-medium text-gray-700 mb-2">
              Bewertungs-URL *
            </label>
            <input
              type="url"
              id="review_url"
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
