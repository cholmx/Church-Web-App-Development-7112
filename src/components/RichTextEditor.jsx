import React, { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder, rows = 12, className = '' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
      
      // Force Inter Tight on all content after setting innerHTML
      const allElements = editorRef.current.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.fontFamily = 'Inter Tight, sans-serif';
        el.style.letterSpacing = '0.1px';
      });
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      // Force Inter Tight on all elements after input
      const allElements = editorRef.current.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.fontFamily = 'Inter Tight, sans-serif';
        el.style.letterSpacing = '0.1px';
      });
      
      onChange({
        target: {
          value: editorRef.current.innerHTML
        }
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get pasted data
    const paste = (e.clipboardData || window.clipboardData).getData('text/html') || 
                  (e.clipboardData || window.clipboardData).getData('text/plain');
    
    if (paste) {
      // Insert the content exactly as it is
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        // Create a document fragment from the pasted HTML
        const fragment = document.createRange().createContextualFragment(paste);
        
        // Force Inter Tight on all pasted elements
        const pastedElements = fragment.querySelectorAll('*');
        pastedElements.forEach(el => {
          el.style.fontFamily = 'Inter Tight, sans-serif';
          el.style.letterSpacing = '0.1px';
        });
        
        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      handleInput();
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: Insert line break
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        handleInput();
      } else {
        // Enter: Create new paragraph
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Check if we're inside a paragraph
        let currentP = range.startContainer;
        while (currentP && currentP.nodeType !== Node.ELEMENT_NODE) {
          currentP = currentP.parentNode;
        }
        
        if (currentP && currentP.tagName === 'P') {
          // Split the current paragraph
          const newP = document.createElement('p');
          newP.innerHTML = '<br>';
          newP.style.fontFamily = 'Inter Tight, sans-serif';
          newP.style.letterSpacing = '0.1px';
          
          // Insert after current paragraph
          currentP.parentNode.insertBefore(newP, currentP.nextSibling);
          
          // Move cursor to new paragraph
          range.setStart(newP, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // Create new paragraph
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          p.style.fontFamily = 'Inter Tight, sans-serif';
          p.style.letterSpacing = '0.1px';
          range.deleteContents();
          range.insertNode(p);
          range.setStart(p, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        handleInput();
      }
    }
  };

  const minHeight = rows * 1.5;

  return (
    <div className={`border border-accent-dark rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Simple Toolbar */}
      <div className="bg-gray-50 border-b border-accent-dark p-3 text-sm text-gray-600" style={{ fontFamily: 'Inter Tight, sans-serif', letterSpacing: '0.1px' }}>
        💡 <strong>Tip:</strong> Paste formatted text directly! Bold, italics, lists, and paragraphs will be preserved. 
        Press <kbd style={{ fontFamily: 'Inter Tight, sans-serif' }}>Enter</kbd> for new paragraph, <kbd style={{ fontFamily: 'Inter Tight, sans-serif' }}>Shift+Enter</kbd> for line break.
      </div>
      
      {/* Content Editable Area */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="rich-text-editor"
        style={{
          minHeight: `${minHeight}rem`,
          padding: '1rem',
          outline: 'none',
          lineHeight: '1.6',
          fontFamily: 'Inter Tight, sans-serif',
          letterSpacing: '0.1px'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        .rich-text-editor:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px;
        }
        
        .rich-text-editor:focus {
          outline: none;
        }
        
        .rich-text-editor * {
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        .rich-text-editor p {
          margin-bottom: 1rem;
          line-height: 1.6;
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        .rich-text-editor p:last-child {
          margin-bottom: 0;
        }
        
        .rich-text-editor p:empty {
          min-height: 1.5rem;
        }
        
        .rich-text-editor br {
          line-height: 1.6;
        }
        
        .rich-text-editor h1, .rich-text-editor h2, .rich-text-editor h3,
        .rich-text-editor h4, .rich-text-editor h5, .rich-text-editor h6 {
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        .rich-text-editor strong, .rich-text-editor b {
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        .rich-text-editor em, .rich-text-editor i {
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        .rich-text-editor ul, .rich-text-editor ol {
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        .rich-text-editor li {
          font-family: 'Inter Tight', sans-serif !important;
          letter-spacing: 0.1px !important;
        }
        
        kbd {
          background-color: #f1f1f1;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 1px 4px;
          font-size: 0.85rem;
          font-family: 'Inter Tight', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;