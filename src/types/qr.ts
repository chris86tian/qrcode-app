export type ContentType = 
  | 'url' 
  | 'contact' 
  | 'wifi' 
  | 'text' 
  | 'email' 
  | 'sms' 
  | 'whatsapp' 
  | 'spotify' 
  | 'youtube' 
  | 'bewertung';

export type QRStyle = 
  | 'classic'
  | 'glassmorphism-dots'
  | 'pixel-perfect';

export interface QRFormData {
  content_type: ContentType;
  darkColor: string;
  lightColor: string;
  transparent: boolean;
  whiteQrMode: 'invert-colors' | 'dark-background' | 'outlined' | 'with-border' | 'force-transparent';
  qrStyle?: QRStyle;
  
  // URL fields
  url?: string;
  
  // Contact fields
  firstName?: string;
  lastName?: string;
  organization?: string;
  position?: string;
  phoneWork?: string;
  phoneMobile?: string;
  email?: string;
  website?: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  
  // WiFi fields
  wifi_ssid?: string;
  wifi_password?: string;
  wifi_encryption?: 'WPA' | 'WEP' | 'nopass';
  wifi_hidden?: boolean;
  
  // Text field
  text?: string;
  
  // Email fields
  email_address?: string;
  email_subject?: string;
  email_body?: string;
  
  // SMS fields
  sms_number?: string;
  sms_body?: string;
  
  // WhatsApp fields
  whatsapp_number?: string;
  whatsapp_message?: string;
  
  // Spotify field
  spotify_url?: string;
  
  // YouTube field
  youtube_url?: string;
  
  // Review field
  review_url?: string;
}

export interface QRGenerationResult {
  qrCodeUrl: string;
}
