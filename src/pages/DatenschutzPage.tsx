import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatenschutzPage: React.FC = () => {
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

        {/* Privacy Policy Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 lg:p-12 shadow-2xl"
        >
          <header className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4 flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-600" />
              Datenschutzerklärung
            </h1>
            <p className="text-xl text-gray-600">
              Informationen zum Umgang mit Ihren Daten
            </p>
          </header>

          <div className="prose prose-lg max-w-none space-y-8">
            
            {/* Quick Overview */}
            <section className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Datenschutz auf einen Blick
              </h2>
              
              <div className="space-y-4 text-blue-700">
                <div>
                  <h3 className="font-semibold">Allgemeine Hinweise</h3>
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                    personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                    Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Datenerfassung auf dieser Website</h3>
                  <p>
                    <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. 
                    Dessen Kontaktdaten können Sie dem Impressum entnehmen.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Wie erfassen wir Ihre Daten?</h3>
                  <p>
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. 
                    Hierbei kann es sich z. B. um Daten handeln, die Sie zur QR-Code-Generierung eingeben.
                  </p>
                  <p>
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. 
                    Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder 
                    Uhrzeit des Seitenaufrufs).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Wofür nutzen wir Ihre Daten?</h3>
                  <p>
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website 
                    zu gewährleisten. Daten, die Sie zur Generierung von QR-Codes eingeben, werden 
                    ausschließlich zur Erstellung des QR-Codes verwendet und <strong>nicht dauerhaft gespeichert</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Processing for QR Codes */}
            <section className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6" />
                QR-Code Datenverarbeitung
              </h2>
              
              <div className="space-y-4 text-green-700">
                <div>
                  <h3 className="font-semibold">Lokale Verarbeitung</h3>
                  <p>
                    Alle QR-Codes werden lokal in Ihrem Browser generiert. Ihre eingegebenen Daten 
                    (URLs, Kontaktdaten, WLAN-Informationen etc.) werden nur temporär zur Erstellung 
                    des QR-Codes verarbeitet und <strong>nicht auf unseren Servern gespeichert</strong>.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Logo-Upload</h3>
                  <p>
                    Hochgeladene Logos werden nur temporär zur Einbindung in den QR-Code verarbeitet 
                    und danach automatisch gelöscht. Wir speichern keine Logos dauerhaft.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Keine Tracking oder Analytics</h3>
                  <p>
                    Wir verwenden keine Tracking-Tools, Analytics oder Cookies zur Verfolgung 
                    Ihres Nutzerverhaltens. Ihre Privatsphäre ist uns wichtig.
                  </p>
                </div>
              </div>
            </section>

            {/* Technical Data */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Technische Daten
              </h2>
              
              <div className="bg-white/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Server-Log-Dateien</h3>
                <p className="text-gray-700 mb-4">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in 
                  so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:
                </p>
                
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                
                <p className="text-gray-700 mt-4">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
                  Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Ihre Rechte
              </h2>
              
              <div className="bg-white/50 rounded-2xl p-6">
                <p className="text-gray-700 mb-4">
                  Sie haben jederzeit das Recht auf:
                </p>
                
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten</li>
                  <li>Berichtigung oder Löschung Ihrer Daten</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Widerspruch gegen die Verarbeitung</li>
                  <li>Beschwerde bei der zuständigen Aufsichtsbehörde</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Kontakt bei Datenschutzfragen
              </h2>
              
              <div className="bg-white/50 rounded-2xl p-6">
                <p className="text-gray-700">
                  Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>E-Mail:</strong> mail@lipalife.de<br />
                  <strong>Adresse:</strong> Obertraubenbach 3, 93489 Schorndorf
                </p>
              </div>
            </section>

            <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
              <p>Stand: Januar 2025</p>
              <p>Diese Datenschutzerklärung wurde mit größter Sorgfalt erstellt.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DatenschutzPage;
