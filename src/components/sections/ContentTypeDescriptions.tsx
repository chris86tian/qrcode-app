import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link, User, Wifi, Type, Mail, MessageSquare, 
  MessageCircle, Music, Play, Star 
} from 'lucide-react';

const contentTypes = [
  {
    icon: Link,
    title: 'URL',
    description: 'Leiten Sie Nutzer direkt auf eine beliebige Webseite, einen Online-Shop, ein Social-Media-Profil oder ein Online-Dokument weiter.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: User,
    title: 'Kontakt (vCard)',
    description: 'Speichern Sie vollständige Kontaktdaten (Name, Firma, Telefon, E-Mail, Adresse, Webseite). Beim Scannen können diese direkt ins Adressbuch übernommen werden.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Wifi,
    title: 'Wi-Fi',
    description: 'Ermöglichen Sie Gästen oder Kunden eine einfache Verbindung zu Ihrem WLAN-Netzwerk, ohne manuell SSID und Passwort eingeben zu müssen.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Type,
    title: 'Text',
    description: 'Zeigen Sie einen einfachen Text an, z.B. eine Notiz, eine Seriennummer, einen Gutscheincode oder eine kurze Information.',
    color: 'from-gray-500 to-gray-600'
  },
  {
    icon: Mail,
    title: 'E-Mail',
    description: 'Öffnet das E-Mail-Programm des Nutzers mit einer vordefinierten Empfängeradresse, Betreffzeile und Nachrichtentext.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: MessageSquare,
    title: 'SMS',
    description: 'Öffnet die SMS-App des Nutzers mit einer vordefinierten Telefonnummer und einem Nachrichtentext.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Startet einen WhatsApp-Chat mit einer vordefinierten Telefonnummer und optional einer vorgefertigten Nachricht.',
    color: 'from-green-400 to-green-500'
  },
  {
    icon: Music,
    title: 'Spotify',
    description: 'Verlinken Sie direkt zu einem Song, Album, einer Playlist oder einem Künstlerprofil auf Spotify.',
    color: 'from-green-600 to-green-700'
  },
  {
    icon: Play,
    title: 'YouTube',
    description: 'Leiten Sie Nutzer direkt zu einem YouTube-Video, einem Kanal oder einer Playlist weiter.',
    color: 'from-red-600 to-red-700'
  },
  {
    icon: Star,
    title: 'Bewertung',
    description: 'Verlinken Sie direkt zu Ihrer Bewertungsseite, z.B. auf Google Maps, Yelp, Trustpilot oder einer anderen Plattform.',
    color: 'from-orange-500 to-orange-600'
  }
];

const ContentTypeDescriptions: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Was können Sie mit QR-Codes machen?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Wählen Sie den passenden Inhaltstyp für Ihren Anwendungsfall und erstellen Sie 
            professionelle QR-Codes in Sekunden.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContentTypeDescriptions;
