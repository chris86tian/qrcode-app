import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Type, Sparkles, Heart } from 'lucide-react';
import DonationModal from '../donation/DonationModal';

const Header: React.FC = () => {
  const location = useLocation();
  const [showDonationModal, setShowDonationModal] = useState(false);

  const navItems = [
    { path: '/', label: 'QR Generator', icon: QrCode },
    { path: '/social-media-unicode', label: 'Unicode Text', icon: Type },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDonationClose = () => {
    setShowDonationModal(false);
    scrollToTop();
  };

  return (
    <>
      <motion.header 
        className="relative overflow-hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient opacity-90" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Logo & Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <QrCode className="w-8 h-8 text-white" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  K1Q.de
                </h1>
              </motion.div>

              <nav className="flex gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-white/20 text-white shadow-lg' 
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Donation Button */}
                <motion.button
                  onClick={() => setShowDonationModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-4 h-4 text-pink-300" />
                  <span className="hidden sm:inline">Spenden</span>
                </motion.button>
              </nav>
            </div>

            {/* Title & Description */}
            <div className="text-center lg:text-right">
              <motion.h2 
                className="text-2xl lg:text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {location.pathname === '/social-media-unicode' 
                  ? 'Unicode Text Generator' 
                  : 'QR-Code Generator mit Logo'
                }
              </motion.h2>
              <motion.p 
                className="text-white/90 text-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {location.pathname === '/social-media-unicode'
                  ? 'Erstelle coole Schriftarten für Social Media & mehr'
                  : 'Erstellen Sie individuelle QR-Codes mit Logo und Farben'
                }
              </motion.p>
            </div>

            {/* Support Message */}
            <div className="hidden lg:block">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white/80 text-sm mb-2">
                  💜 Unterstützen Sie uns
                </p>
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="text-xs text-white/70 hover:text-white underline transition-colors"
                >
                  Kostenlos durch Spenden
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={handleDonationClose}
      />
    </>
  );
};

export default Header;
