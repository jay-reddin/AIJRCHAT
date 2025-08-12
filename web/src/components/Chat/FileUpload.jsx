import { useState, useCallback } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import useUpload from '@/utils/useUpload';

export default function FileUpload({ onFileUploaded, theme, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [upload, { loading }] = useUpload();

  const isDark = theme === 'dark';

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || loading) return;

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, [disabled, loading]);

  const handleFileInput = useCallback(async (e) => {
    if (disabled || loading) return;

    const files = Array.from(e.target.files);
    await processFiles(files);
    e.target.value = ''; // Reset input
  }, [disabled, loading]);

  const processFiles = async (files) => {
    for (const file of files) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'text/plain', 'text/csv',
        'application/json',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported.`);
        continue;
      }

      try {
        // Convert file to base64 for upload
        const base64 = await fileToBase64(file);
        const { url, mimeType, error } = await upload({ base64 });

        if (error) {
          alert(`Failed to upload ${file.name}: ${error}`);
          continue;
        }

        const uploadedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: url,
          mimeType: mimeType
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);
        onFileUploaded(uploadedFile);
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type === 'application/pdf') return <FileText size={16} />;
    return <File size={16} />;
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
          dragActive
            ? isDark
              ? 'border-purple-400 bg-purple-900/20'
              : 'border-purple-500 bg-purple-50'
            : isDark
            ? 'border-[#374151] hover:border-[#4B5563]'
            : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
          accept="image/*,.pdf,.txt,.csv,.json,.docx,.doc"
        />
        
        <div className="text-center">
          <Upload size={24} className={`mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {loading ? 'Uploading...' : 'Drop files here or click to browse'}
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Images, PDFs, Text, JSON, Word docs (max 10MB)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Uploaded Files:
          </p>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded border ${
                isDark
                  ? 'bg-[#1B1B1E] border-[#374151]'
                  : 'bg-[#F8F9FA] border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-center gap-2">
                {getFileIcon(file.type)}
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {file.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className={`p-1 rounded hover:bg-red-500/20 ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}