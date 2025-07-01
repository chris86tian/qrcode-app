import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
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
            Zurück zum Generator
          </Link>
        </motion.div>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 lg:p-12 shadow-2xl"
        >
          <header className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              QR-Codes mit Logo – So geht's!
            </h1>
            <p className="text-xl text-gray-600">
              Machen Sie Ihre QR-Codes unverwechselbar
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <h2>Warum ein Logo im QR-Code?</h2>
            <p>
              Ein QR-Code mit Ihrem Firmenlogo oder einem anderen Erkennungszeichen steigert den 
              Wiedererkennungswert und schafft Vertrauen. Nutzer sehen sofort, wohin der Code führt 
              oder wer dahintersteckt. Das ist besonders wichtig für Marketingmaterialien, 
              Visitenkarten oder Produktverpackungen.
            </p>

            <div className="my-8 text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-2xl">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-500">Beispiel QR-Code mit Logo</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Beispiel: QR-Code mit Logo in der Mitte
              </p>
            </div>

            <h2>So erstellen Sie einen QR-Code mit Logo auf K1Q.de</h2>
            <ol>
              <li>
                <strong>Inhaltstyp wählen:</strong> Entscheiden Sie, welche Information Ihr QR-Code 
                enthalten soll (z.B. URL, Kontaktdaten, WLAN-Zugang).
              </li>
              <li>
                <strong>Daten eingeben:</strong> Füllen Sie die erforderlichen Felder für den 
                gewählten Inhaltstyp aus.
              </li>
              <li>
                <strong>Logo hochladen:</strong> Klicken Sie auf das Feld "Logo" und wählen Sie 
                Ihre Logodatei aus (PNG, JPG, SVG, max. 2MB).
              </li>
              <li>
                <strong>Farben anpassen (optional):</strong> Wählen Sie individuelle Farben für 
                die Punkte und den Hintergrund Ihres QR-Codes. Achten Sie auf guten Kontrast!
              </li>
              <li>
                <strong>Generieren:</strong> Klicken Sie auf "QR-Code generieren".
              </li>
              <li>
                <strong>Herunterladen:</strong> Ihr individueller QR-Code mit Logo wird angezeigt 
                und kann heruntergeladen werden (meist als PNG).
              </li>
            </ol>

            <h2>Wichtige Tipps für Logos in QR-Codes</h2>
            <ul>
              <li>
                <strong>Einfachheit:</strong> Verwenden Sie ein einfaches, klares Logo. Komplexe 
                Details können die Lesbarkeit beeinträchtigen.
              </li>
              <li>
                <strong>Größe & Position:</strong> Das Logo wird mittig platziert. Unser Generator 
                passt die Größe automatisch an, aber das Logo sollte nicht zu viel vom Code verdecken. 
                QR-Codes haben eine eingebaute Fehlerkorrektur, die einen gewissen Bereich (bis zu 30%) 
                abdecken kann, ohne die Funktion zu stören.
              </li>
              <li>
                <strong>Kontrast:</strong> Stellen Sie sicher, dass das Logo sich farblich gut vom 
                QR-Code abhebt, aber auch der Kontrast des Codes selbst hoch genug bleibt.
              </li>
              <li>
                <strong>Testen:</strong> Scannen Sie den generierten QR-Code immer mit verschiedenen 
                Geräten und Apps, um sicherzustellen, dass er einwandfrei funktioniert.
              </li>
            </ul>

            <h2>Fazit</h2>
            <p>
              Ein Logo im QR-Code ist eine einfache, aber effektive Methode, um Ihre Marke zu stärken 
              und Ihre Codes professioneller wirken zu lassen. Mit dem K1Q.de QR-Code Generator ist 
              das Hinzufügen Ihres Logos ein Kinderspiel. Probieren Sie es gleich aus!
            </p>

            <div className="text-center mt-8">
              <Link 
                to="/"
                className="btn-primary inline-flex items-center gap-2"
              >
                Jetzt QR-Code mit Logo erstellen!
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPage;
