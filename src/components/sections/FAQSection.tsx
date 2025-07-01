import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: 'Was ist ein QR-Code?',
    answer: 'Ein QR-Code (Quick Response Code) ist ein zweidimensionaler Barcode, der Informationen speichert, die schnell von Smartphones oder QR-Code-Scannern gelesen werden können. Er kann Links, Text, Kontaktdaten, WLAN-Zugänge und mehr enthalten.'
  },
  {
    question: 'Wie erstelle ich einen QR-Code mit Logo?',
    answer: 'Wählen Sie den gewünschten Inhaltstyp (z.B. URL), geben Sie die Daten ein und laden Sie Ihr Logo über das "Logo"-Feld hoch. Unser Generator fügt das Logo automatisch in die Mitte des QR-Codes ein. Achten Sie darauf, dass das Logo nicht zu groß ist, um die Lesbarkeit nicht zu beeinträchtigen.'
  },
  {
    question: 'Kann ich die Farben des QR-Codes ändern?',
    answer: 'Ja, Sie können die Farbe der dunklen Punkte (Vordergrund) und des Hintergrunds mit den Farbwählern anpassen. Achten Sie auf einen ausreichenden Kontrast zwischen Vorder- und Hintergrundfarbe, damit der QR-Code gut lesbar bleibt.'
  },
  {
    question: 'Wie funktioniert der Transparenz-Modus?',
    answer: 'Mit dem Transparenz-Modus können Sie QR-Codes mit transparentem Hintergrund erstellen, die sich perfekt in verschiedene Designs einfügen. Bei weißen QR-Codes bieten wir automatisch Alternativen wie Farben umkehren oder dunkle Hintergründe an.'
  },
  {
    question: 'Welche Dateiformate werden für das Logo akzeptiert?',
    answer: 'Wir akzeptieren Logos in den Formaten PNG, JPG, JPEG und SVG. Die maximale Dateigröße beträgt 2MB. Für beste Ergebnisse verwenden Sie einfache, kontrastreiche Logos.'
  },
  {
    question: 'Warum sind weiße QR-Codes problematisch?',
    answer: 'Weiße QR-Codes sind auf transparentem oder hellem Hintergrund praktisch unsichtbar. Unser Generator bietet automatisch Alternativen wie Farben umkehren, dunkle Hintergründe, Rahmen oder Outline-Effekte, um die Sichtbarkeit zu gewährleisten.'
  },
  {
    question: 'Ist die Nutzung des QR-Code Generators kostenlos?',
    answer: 'Ja, die Erstellung von QR-Codes mit unserem Generator, einschließlich der Optionen für Logo und Farben, ist komplett kostenlos. Alle Features stehen Ihnen ohne Einschränkungen zur Verfügung.'
  },
  {
    question: 'Bleiben die generierten QR-Codes für immer gültig?',
    answer: 'Ja, die generierten QR-Codes selbst haben kein Ablaufdatum. Sie funktionieren so lange, wie die darin enthaltenen Informationen (z.B. der Link) gültig und erreichbar sind.'
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold gradient-text">
              Häufig gestellte Fragen
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Alles was Sie über unseren QR-Code Generator wissen müssen
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4" />
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
