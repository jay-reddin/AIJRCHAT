import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';

export default function FileUpload({ onFileUploaded, attachedFiles, setAttachedFiles, theme = 'dark' }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const isDark = theme === 'dark';

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback((files) => {
    files.forEach(file => {
      // Validate file type and size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'text/plain', 'text/csv', 'application/json', 'text/markdown',
        'application/pdf', 'text/html', 'text/css', 'text/javascript'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported.`);
        return;
      }

      // Create file object
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileObj = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          content: e.target.result,
          isImage: file.type.startsWith('image/'),
          isText: file.type.startsWith('text/') || file.type.includes('json'),
        };

        setAttachedFiles(prev => [...prev, fileObj]);
        if (onFileUploaded) {
          onFileUploaded(fileObj);
        }
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  }, [onFileUploaded, setAttachedFiles]);

  const removeFile = useCallback((fileId) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  }, [setAttachedFiles]);

  const getFileIcon = (file) => {
    if (file.isImage) return <Image size={16} />;
    if (file.isText) return <FileText size={16} />;
    return <File size={16} />;
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-purple-500 bg-purple-500/10' 
            : isDark 
              ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Drop files here or click to browse
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Images, text files, JSON, PDF (max 10MB)
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp,.txt,.csv,.json,.md,.pdf,.html,.css,.js"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Attached files preview */}
      {attachedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Attached Files ({attachedFiles.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attachedFiles.map(file => (
              <div
                key={file.id}
                className={`
                  flex items-center gap-3 p-2 rounded-lg border
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                {/* File thumbnail/icon */}
                <div className="flex-shrink-0">
                  {file.isImage ? (
                    <img
                      src={file.content}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded border"
                    />
                  ) : (
                    <div className={`
                      w-10 h-10 rounded border flex items-center justify-center
                      ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
                    `}>
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {file.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {file.type} • {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className={`
                    p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors
                  `}
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
