import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Grid3X3, Square } from 'lucide-react';
import { QRStyle } from '../../types/qr';

interface StyleSelectorProps {
  selectedStyle: QRStyle;
  onStyleChange: (style: QRStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const styles = [
    {
      id: 'classic' as QRStyle,
      name: 'Klassisch',
      description: 'Standard QR-Code Design',
      icon: Square,
      preview: 'classic-preview',
      available: true
    },
    {
      id: 'glassmorphism-dots' as QRStyle,
      name: 'Glassmorphism Dots',
      description: 'Transparente Punkte mit Blur-Effekt',
      icon: Sparkles,
      preview: 'glass-preview',
      available: true, // ✅ REAKTIVIERT
      badge: '✨ Neu'
    },
    {
      id: 'pixel-perfect' as QRStyle,
      name: 'Pixel Perfect',
      description: 'Retro-Gaming inspirierte Quadrate',
      icon: Grid3X3,
      preview: 'pixel-preview',
      available: true, // ✅ REAKTIVIERT
      badge: '🎮 Retro'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">🎨 QR-Code Stil</h3>
        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          Alle Stile verfügbar
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;
          const isAvailable = style.available;
          
          return (
            <motion.button
              key={style.id}
              onClick={() => isAvailable && onStyleChange(style.id)}
              disabled={!isAvailable}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                ${!isAvailable 
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                  : isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
              whileHover={isAvailable ? { scale: 1.02 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
            >
              {/* Selection indicator */}
              {isSelected && isAvailable && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
              
              {/* Badge for special styles */}
              {style.badge && isAvailable && (
                <motion.div
                  className="absolute -top-1 -left-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg"
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                >
                  {style.badge}
                </motion.div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${!isAvailable 
                    ? 'bg-gray-100 text-gray-400'
                    : isSelected 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${!isAvailable ? 'text-gray-400' : 'text-gray-900'}`}>
                    {style.name}
                  </h4>
                  <p className={`text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                    {style.description}
                  </p>
                </div>
              </div>
              
              {/* Style Preview */}
              <div className="mt-4 flex justify-center">
                <div className={`w-16 h-16 rounded-lg overflow-hidden border ${!isAvailable ? 'border-gray-200' : 'border-gray-200'}`}>
                  {style.id === 'classic' && (
                    <div className="w-full h-full bg-white grid grid-cols-4 gap-0.5 p-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            [0, 1, 2, 4, 7, 8, 11, 13, 14, 15].includes(i)
                              ? !isAvailable ? 'bg-gray-400' : 'bg-black'
                              : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {style.id === 'glassmorphism-dots' && (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 grid grid-cols-4 gap-1 p-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full ${
                            [0, 1, 2, 4, 7, 8, 11, 13, 14, 15].includes(i)
                              ? !isAvailable 
                                ? 'bg-gray-300/60 border border-gray-300/30' 
                                : 'bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm'
                              : 'bg-transparent'
                          }`}
                          style={{
                            backdropFilter: [0, 1, 2, 4, 7, 8, 11, 13, 14, 15].includes(i) && isAvailable ? 'blur(4px)' : 'none'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {style.id === 'pixel-perfect' && (
                    <div className="w-full h-full bg-gray-900 grid grid-cols-4 gap-0.5 p-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            [0, 1, 2, 4, 7, 8, 11, 13, 14, 15].includes(i)
                              ? !isAvailable 
                                ? 'bg-gray-500 shadow-sm'
                                : 'bg-gradient-to-br from-green-400 to-blue-500 shadow-sm'
                              : 'bg-gray-800'
                          }`}
                          style={{
                            boxShadow: [0, 1, 2, 4, 7, 8, 11, 13, 14, 15].includes(i) && isAvailable
                              ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)' 
                              : 'inset 0 1px 0 rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Availability status */}
              {!isAvailable && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-400 font-medium">Bald verfügbar</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Info box for advanced styles */}
      <motion.div
        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">✨ Erweiterte Stile verfügbar!</h4>
            <p className="text-sm text-blue-700">
              Alle QR-Code Stile sind jetzt aktiv. Probieren Sie die neuen Glassmorphism Dots und Pixel Perfect Designs aus!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StyleSelector;
