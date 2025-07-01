import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, Check } from 'lucide-react';

interface LogoUploadProps {
  logo: File | null;
  onLogoChange: (file: File | null) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ logo, onLogoChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onLogoChange(acceptedFiles[0]);
    }
  }, [onLogoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false
  });

  const removeLogo = () => {
    onLogoChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Logo</h3>
      </div>

      {!logo ? (
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-3">
            <motion.div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                isDragActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}
              animate={{ rotate: isDragActive ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Upload className={`w-6 h-6 ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`} />
            </motion.div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? 'Logo hier ablegen...' : 'Logo hochladen'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, SVG (max. 2MB)
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  {logo.name}
                </p>
                <p className="text-xs text-green-600">
                  {(logo.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={removeLogo}
              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center text-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-gray-500">
        Das Logo wird mittig im QR-Code platziert. Für beste Ergebnisse verwenden Sie einfache, kontrastreiche Logos.
      </p>
    </div>
  );
};

export default LogoUpload;
