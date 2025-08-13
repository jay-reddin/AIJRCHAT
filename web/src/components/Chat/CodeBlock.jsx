import { useState, useRef, useEffect } from 'react';
import { Copy, CheckCheck, Play, Eye, Download, Maximize2, Minimize2, X } from 'lucide-react';

export default function CodeBlock({ 
  children, 
  language = '', 
  filename = '', 
  theme = 'dark',
  showLineNumbers = true,
  isStreaming = false 
}) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const codeRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  const isDark = theme === 'dark';
  const codeContent = typeof children === 'string' ? children : children?.toString() || '';

  // Auto-detect language if not provided
  const detectedLanguage = language || detectLanguage(codeContent);
  
  // Check if code is previewable (HTML, CSS, JS)
  const isPreviewable = ['html', 'css', 'javascript', 'js', 'tsx', 'jsx'].includes(detectedLanguage.toLowerCase());
  
  // Check if code can be executed/run
  const isExecutable = ['javascript', 'js', 'python', 'node'].includes(detectedLanguage.toLowerCase());

  // Auto-scroll to bottom when content changes during streaming
  useEffect(() => {
    if (isStreaming && codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [codeContent, isStreaming]);

  // Handle fullscreen mode
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const extension = getFileExtension(detectedLanguage);
    const fileName = filename || `code.${extension}`;
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const toggleExpand = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const generatePreview = () => {
    if (!isPreviewable) return null;

    let previewContent = '';

    if (detectedLanguage === 'html' || codeContent.includes('<html')) {
      previewContent = codeContent;
    } else if (detectedLanguage === 'css') {
      previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${codeContent}</style>
        </head>
        <body>
          <div style="padding: 20px;">
            <h1>CSS Preview</h1>
            <p>Sample content to demonstrate the CSS styles.</p>
            <button>Sample Button</button>
            <div class="container">Sample container</div>
          </div>
        </body>
        </html>
      `;
    } else if (['javascript', 'js'].includes(detectedLanguage)) {
      previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            #output { margin-top: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>JavaScript Preview</h1>
          <div id="output"></div>
          <script>
            // Redirect console.log to output div
            const output = document.getElementById('output');
            const originalLog = console.log;
            console.log = function(...args) {
              output.innerHTML += args.join(' ') + '<br>';
              originalLog.apply(console, args);
            };
            
            try {
              ${codeContent}
            } catch (error) {
              output.innerHTML += '<span style="color: red;">Error: ' + error.message + '</span>';
            }
          </script>
        </body>
        </html>
      `;
    }

    return previewContent;
  };

  // Format code with enhanced syntax highlighting
  const formatCode = (code) => {
    if (!code) return '';
    
    let formatted = code
      // Keywords
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally)\b/g, 
        '<span style="color: #c792ea;">$1</span>')
      // Strings
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
        '<span style="color: #c3e88d;">$1$2$1</span>')
      // Numbers
      .replace(/\b(\d+(?:\.\d+)?)\b/g, 
        '<span style="color: #f78c6c;">$1</span>')
      // Comments
      .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
        '<span style="color: #546e7a; font-style: italic;">$1</span>')
      // HTML tags
      .replace(/(<\/?[a-zA-Z][^>]*>)/g, 
        '<span style="color: #f07178;">$1</span>')
      // CSS properties
      .replace(/([a-z-]+)(\s*:\s*)/g, 
        '<span style="color: #82aaff;">$1</span>$2');

    return formatted;
  };

  const containerClasses = `
    ${isFullscreen 
      ? 'fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90' 
      : 'relative rounded-lg border overflow-hidden'
    } ${isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }
  `;

  const codeBlockContent = (
    <div className={containerClasses} ref={containerRef}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDark 
          ? 'bg-gray-800 border-gray-700 text-gray-300' 
          : 'bg-gray-100 border-gray-200 text-gray-700'
      } ${isFullscreen ? 'relative' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wide opacity-75">
            {detectedLanguage || 'text'}
          </span>
          {filename && (
            <span className="text-xs opacity-60">• {filename}</span>
          )}
          {isStreaming && (
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Generating...
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {isPreviewable && (
            <button
              onClick={togglePreview}
              className={`p-1.5 rounded hover:bg-opacity-20 transition-all duration-200 ${
                showPreview ? 'bg-blue-500 bg-opacity-20 text-blue-400' : 'hover:bg-gray-500'
              }`}
              title="Toggle preview"
            >
              <Eye size={14} />
            </button>
          )}
          
          {isExecutable && (
            <button
              className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
              title="Run code (coming soon)"
            >
              <Play size={14} />
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className={`p-1.5 rounded hover:bg-opacity-20 transition-all duration-200 ${
              downloaded ? 'text-green-400' : 'hover:bg-gray-500'
            }`}
            title="Download code"
          >
            {downloaded ? <CheckCheck size={14} /> : <Download size={14} />}
          </button>
          
          <button
            onClick={toggleExpand}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Expand fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded hover:bg-opacity-20 transition-all duration-200 ${
              copied ? 'text-green-400' : 'hover:bg-gray-500'
            }`}
            title="Copy code"
          >
            {copied ? (
              <CheckCheck size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>

          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors ml-2"
              title="Close fullscreen"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className={`${isFullscreen ? 'flex-1 flex' : 'relative'}`}>
        {/* Code Content */}
        <div className={`${showPreview && isPreviewable ? 'w-1/2' : 'w-full'} ${
          isFullscreen ? 'h-full' : isExpanded ? 'max-h-none' : 'max-h-96'
        } overflow-auto transition-all duration-300`}>
          <pre 
            ref={codeRef}
            className={`p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            } ${isFullscreen ? 'h-full' : ''}`}
            style={{ 
              tabSize: 2,
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {showLineNumbers && (
              <div className="absolute left-0 top-0 pt-4 pb-4 pl-2 pr-4 select-none">
                {codeContent.split('\n').map((_, index) => (
                  <div 
                    key={index} 
                    className={`text-xs leading-relaxed ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                    style={{ minHeight: '1.5em' }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            )}
            <div 
              className={showLineNumbers ? 'ml-8' : ''}
              dangerouslySetInnerHTML={{ __html: formatCode(codeContent) }}
            />
          </pre>
          
          {!isExpanded && !isFullscreen && codeContent.split('\n').length > 20 && (
            <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${
              isDark ? 'from-gray-900' : 'from-gray-50'
            } to-transparent`} />
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && isPreviewable && (
          <div className={`${showPreview ? 'w-1/2' : 'w-0'} border-l ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          } transition-all duration-300`}>
            <div className={`px-4 py-2 text-xs font-medium border-b ${
              isDark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Live Preview
            </div>
            <div className={`${isFullscreen ? 'h-full' : 'h-64'} p-0`}>
              <iframe
                ref={previewRef}
                srcDoc={generatePreview()}
                className="w-full h-full border-none"
                title="Code Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render fullscreen in portal-like manner
  if (isFullscreen) {
    return (
      <>
        {codeBlockContent}
      </>
    );
  }

  return codeBlockContent;
}

// Helper functions
function detectLanguage(code) {
  if (code.includes('function') && code.includes('{')) return 'javascript';
  if (code.includes('<html') || code.includes('<!DOCTYPE')) return 'html';
  if (code.includes('@media') || code.includes('css')) return 'css';
  if (code.includes('def ') && code.includes(':')) return 'python';
  if (code.includes('class ') && code.includes('extends')) return 'java';
  if (code.includes('#include') || code.includes('int main')) return 'c';
  if (code.includes('import React') || code.includes('jsx')) return 'jsx';
  if (code.includes('interface ') || code.includes('type ')) return 'typescript';
  return 'text';
}

function getFileExtension(language) {
  const extensions = {
    javascript: 'js',
    js: 'js',
    typescript: 'ts',
    jsx: 'jsx',
    tsx: 'tsx',
    html: 'html',
    css: 'css',
    python: 'py',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    csharp: 'cs',
    php: 'php',
    ruby: 'rb',
    go: 'go',
    rust: 'rs',
    swift: 'swift',
    kotlin: 'kt'
  };
  return extensions[language.toLowerCase()] || 'txt';
}
