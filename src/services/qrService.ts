import { QRFormData, QRGenerationResult } from '../types/qr';

export const generateQRCode = async (
  formData: QRFormData, 
  logo: File | null
): Promise<QRGenerationResult> => {
  const form = new FormData();
  
  // Add all form data
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value.toString());
    }
  });
  
  // Add logo if present
  if (logo) {
    form.append('logo', logo);
  }
  
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: form,
  });
  
  if (!response.ok) {
    let errorMsg = 'Fehler beim Generieren des QR-Codes.';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(`${response.status}: ${errorMsg}`);
  }
  
  const result = await response.json();
  
  if (!result.qrCodeUrl) {
    throw new Error('Konnte keinen QR-Code empfangen.');
  }
  
  return result;
};
