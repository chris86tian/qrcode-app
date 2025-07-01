import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link, 
  User, 
  Wifi, 
  Type, 
  Mail, 
  MessageSquare, 
  MessageCircle,
  Music,
  Play,
  Star
} from 'lucide-react';
import { ContentType } from '../../types/qr';

interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const contentTypes = [
  { type: 'url' as ContentType, label: 'URL', icon: Link, color: 'from-blue-500 to-blue-600' },
  { type: 'contact' as ContentType, label: 'Kontakt', icon: User, color: 'from-green-500 to-green-600' },
  { type: 'wifi' as ContentType, label: 'Wi-Fi', icon: Wifi, color: 'from-purple-500 to-purple-600' },
  { type: 'text' as ContentType, label: 'Text', icon: Type, color: 'from-gray-500 to-gray-600' },
  { type: 'email' as ContentType, label: 'E-Mail', icon: Mail, color: 'from-red-500 to-red-600' },
  { type: 'sms' as ContentType, label: 'SMS', icon: MessageSquare, color: 'from-yellow-500 to-yellow-600' },
  { type: 'whatsapp' as ContentType, label: 'WhatsApp', icon: MessageCircle, color: 'from-green-400 to-green-500' },
  { type: 'spotify' as ContentType, label: 'Spotify', icon: Music, color: 'from-green-600 to-green-700' },
  { type: 'youtube' as ContentType, label: 'YouTube', icon: Play, color: 'from-red-600 to-red-700' },
  { type: 'bewertung' as ContentType, label: 'Bewertung', icon: Star, color: 'from-orange-500 to-orange-600' },
];

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Inhaltstyp wählen
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {contentTypes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.type;
          
          return (
            <motion.button
              key={item.type}
              onClick={() => onTypeChange(item.type)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background gradient for selected state */}
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 rounded-2xl`}
                  layoutId="selectedBackground"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`p-2 rounded-xl ${
                  isSelected 
                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg` 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
