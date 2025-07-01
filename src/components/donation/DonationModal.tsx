import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Coffee, Server, Wrench, Euro } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [
    { amount: 1, label: '1€', description: 'Ein Kaffee ☕', icon: Coffee },
    { amount: 3, label: '3€', description: 'Server-Unterstützung 🚀', icon: Server },
    { amount: 5, label: '5€', description: 'Wartung & Updates 🔧', icon: Wrench }
  ];

  const handleDonate = async (amount: number) => {
    setIsProcessing(true);
    
    // PayPal donation URL - replace with your actual PayPal.me link or business email
    const paypalUrl = `https://www.paypal.com/donate/?business=chris86tian@gmail.com&amount=${amount}&currency_code=EUR&item_name=QR-Generator+Spende`;
    
    // Open PayPal in new window
    window.open(paypalUrl, '_blank', 'width=600,height=700');
    
    // Close modal after short delay
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  const handleCustomDonate = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount > 0) {
      handleDonate(amount);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unterstützen Sie unser Projekt! 💜
              </h2>
              
              <p className="text-gray-600 leading-relaxed">
                Dieser QR-Generator wird durch <strong>Spenden finanziert</strong>. 
                Ihre Unterstützung hilft uns, die <strong>Server- und Wartungskosten</strong> zu decken 
                und den Service kostenlos anzubieten.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Preset Amounts */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Wählen Sie einen Betrag:
              </h3>
              
              {presetAmounts.map((preset, index) => (
                <motion.button
                  key={preset.amount}
                  onClick={() => handleDonate(preset.amount)}
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                    selectedAmount === preset.amount
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  } disabled:opacity-50`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
                    <preset.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg text-gray-800">
                      {preset.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {preset.description}
                    </div>
                  </div>
                  
                  <div className="text-purple-600 font-semibold">
                    Spenden →
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom Amount */}
            <motion.div
              className="border-t pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Oder beliebiger Betrag:
              </h3>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="5.00"
                    min="1"
                    step="0.50"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                
                <motion.button
                  onClick={handleCustomDonate}
                  disabled={!customAmount || parseFloat(customAmount) <= 0 || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Öffne...
                    </div>
                  ) : (
                    'Spenden'
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              className="mt-6 p-4 bg-gray-50 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <Server className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">100% transparent</div>
                  <div>Alle Spenden fließen in Server & Wartung</div>
                </div>
              </div>
            </motion.div>

            {/* Skip Option */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
              >
                Vielleicht später
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;
