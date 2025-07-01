import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = [
    { to: '/impressum', label: 'Impressum' },
    { to: '/datenschutz', label: 'Datenschutz' },
    { to: '/blog-qr-code-mit-logo', label: 'Blog' },
    { to: '/social-media-unicode', label: 'Unicode Text' },
  ];

  return (
    <motion.footer 
      className="relative mt-20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <motion.h3 
              className="text-2xl font-bold text-white mb-3"
              whileHover={{ scale: 1.05 }}
            >
              K1Q.de
            </motion.h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ihr kostenloser QR-Code Generator mit Premium-Features. 
              Erstellen Sie professionelle QR-Codes mit Logos, 
              individuellen Farben und Transparenz.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright & Love */}
          <div className="text-center md:text-right">
            <motion.div 
              className="flex items-center justify-center md:justify-end gap-2 text-slate-300 text-sm mb-2"
              whileHover={{ scale: 1.05 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              </motion.div>
              <span>in Germany</span>
            </motion.div>
            <p className="text-slate-400 text-xs">
              © 2025 K1Q.de QR-Code Generator
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Powered by React & Modern Web Technologies
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <motion.div 
          className="mt-8 pt-6 border-t border-slate-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-center">
            <p className="text-slate-400 text-xs">
              Alle QR-Codes werden lokal generiert. Ihre Daten verlassen niemals Ihr Gerät.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
