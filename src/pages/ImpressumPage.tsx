import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpressumPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </motion.div>

        {/* Impressum Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 lg:p-12 shadow-2xl"
        >
          <header className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Impressum
            </h1>
            <p className="text-xl text-gray-600">
              Angaben gemäß § 5 TMG
            </p>
          </header>

          <div className="space-y-8">
            
            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Kontakt
              </h2>
              <div className="bg-white/50 rounded-2xl p-6 space-y-3">
                <p className="text-gray-700">
                  <strong>Lipa LIFE</strong><br />
                  (Einzelunternehmen)<br />
                  Inhaber: Christian Götz<br />
                  Obertraubenbach 3<br />
                  93489 Schorndorf<br />
                  Deutschland
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+49 9461 63 88 77 8</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>mail@lipalife.de</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>www.lipalife.de</span>
                  </div>
                </div>
              </div>
            </section>

            {/* VAT ID */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Umsatzsteuer-ID
              </h2>
              <div className="bg-white/50 rounded-2xl p-6">
                <p className="text-gray-700">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                  <strong>DE361798217</strong>
                </p>
              </div>
            </section>

            {/* Responsible for Content */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <div className="bg-white/50 rounded-2xl p-6">
                <p className="text-gray-700">
                  Christian Götz<br />
                  Obertraubenbach 3<br />
                  93489 Schorndorf
                </p>
              </div>
            </section>

            {/* EU Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                EU-Streitschlichtung
              </h2>
              <div className="bg-white/50 rounded-2xl p-6">
                <p className="text-gray-700">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 ml-1"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>.<br />
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
              </div>
            </section>

            {/* Consumer Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Verbraucherstreitbeilegung/Universalschlichtungsstelle
              </h2>
              <div className="bg-white/50 rounded-2xl p-6">
                <p className="text-gray-700">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImpressumPage;
