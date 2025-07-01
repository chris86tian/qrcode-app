import React from 'react';
import { motion } from 'framer-motion';
import QRGenerator from '../components/qr/QRGenerator';
import ContentTypeDescriptions from '../components/sections/ContentTypeDescriptions';
import FAQSection from '../components/sections/FAQSection';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with QR Generator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <QRGenerator />
      </motion.div>

      {/* Content Type Descriptions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16"
      >
        <ContentTypeDescriptions />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16"
      >
        <FAQSection />
      </motion.div>
    </div>
  );
};

export default HomePage;
