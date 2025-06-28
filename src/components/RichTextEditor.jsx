import React, { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder, rows = 12, className = '' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange({
        target: {
          value: editorRef.current.innerHTML
        }
      });
    }
  };

  const handlePaste = (e) => {
    // Allow default paste behavior to preserve formatting
    setTimeout(() => {
      handleInput();
    }, 0);
  };

  const minHeight = rows * 1.5; // Approximate line height calculation

  return (
    <div className={`border border-accent-dark rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Simple Toolbar */}
      <div className="bg-gray-50 border-b border-accent-dark p-3 text-sm text-gray-600 font-inter">
        💡 <strong>Tip:</strong> Paste formatted text directly! Bold, italics, lists, and line breaks will be preserved.
      </div>

      {/* Content Editable Area */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onPaste={handlePaste}
        className="rich-text-editor"
        style={{
          minHeight: `${minHeight}rem`,
          padding: '1rem',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        .rich-text-editor:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        
        .rich-text-editor:focus {
          outline: none;
        }
        
        .rich-text-editor p {
          margin-bottom: 1rem;
        }
        
        .rich-text-editor p:last-child {
          margin-bottom: 0;
        }
        
        .rich-text-editor ul, .rich-text-editor ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .rich-text-editor li {
          margin-bottom: 0.5rem;
        }
        
        .rich-text-editor strong, .rich-text-editor b {
          font-weight: bold;
        }
        
        .rich-text-editor em, .rich-text-editor i {
          font-style: italic;
        }
        
        .rich-text-editor u {
          text-decoration: underline;
        }
        
        .rich-text-editor h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .rich-text-editor h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .rich-text-editor h3 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .rich-text-editor a {
          color: #E2BA49;
          text-decoration: underline;
        }
        
        .rich-text-editor a:hover {
          color: #D4A632;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;