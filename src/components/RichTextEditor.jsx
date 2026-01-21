import React, { useRef, useEffect } from 'react'

const RichTextEditor = ({ value, onChange, placeholder, rows = 12, className = '' }) => {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ''
      // Clean up inline styles after content is set
      cleanupInlineStyles()
    }
  }, [value])

  const cleanupInlineStyles = () => {
    if (!editorRef.current) return
    
    // Remove problematic inline styles from all elements
    const elements = editorRef.current.querySelectorAll('*')
    elements.forEach(element => {
      if (element.style) {
        // Keep only essential styles, remove font-related ones
        const display = element.style.display
        const float = element.style.float
        
        // Clear all styles
        element.removeAttribute('style')
        
        // Restore only essential layout styles if needed
        if (display === 'inline' || display === 'block') {
          element.style.display = display
        }
        if (float && float !== 'none') {
          element.style.float = float
        }
      }
    })
  }

  const handleInput = () => {
    if (editorRef.current && onChange) {
      // Clean up styles before saving
      cleanupInlineStyles()
      onChange({ target: { value: editorRef.current.innerHTML } })
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = (e.clipboardData || window.clipboardData).getData('text/html') ||
                  (e.clipboardData || window.clipboardData).getData('text/plain')

    console.log('PASTE DATA:', paste)

    if (paste) {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        // Create a temporary div to clean the pasted content
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = paste

        console.log('BEFORE PROCESSING:', tempDiv.innerHTML)

        // Convert inline styles to semantic tags
        const processNode = (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase()
            const style = node.style

            // Check if this element has bold/italic/underline styling
            const isBold = style && (style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600)
            const isItalic = style && style.fontStyle === 'italic'
            const isUnderline = style && style.textDecoration?.includes('underline')

            console.log(`Element ${tagName}:`, {
              isBold,
              isItalic,
              isUnderline,
              fontWeight: style?.fontWeight,
              currentHTML: node.outerHTML
            })

            // Process children first
            Array.from(node.childNodes).forEach(child => processNode(child))

            // Wrap content in semantic tags if needed
            if ((isBold || isItalic || isUnderline) && !['strong', 'b', 'em', 'i', 'u'].includes(tagName)) {
              const content = node.innerHTML
              let wrapped = content

              if (isBold) wrapped = `<strong>${wrapped}</strong>`
              if (isItalic) wrapped = `<em>${wrapped}</em>`
              if (isUnderline) wrapped = `<u>${wrapped}</u>`

              node.innerHTML = wrapped
              console.log('WRAPPED:', node.innerHTML)
            }
          }
        }

        processNode(tempDiv)

        console.log('AFTER WRAPPING:', tempDiv.innerHTML)

        // Remove all inline styles and classes
        tempDiv.querySelectorAll('*').forEach(element => {
          element.removeAttribute('style')
          element.removeAttribute('class')
        })

        console.log('FINAL HTML:', tempDiv.innerHTML)

        const fragment = document.createRange().createContextualFragment(tempDiv.innerHTML)
        range.insertNode(fragment)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      handleInput()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      
      if (e.shiftKey) {
        // Shift+Enter: Insert line break
        const br = document.createElement('br')
        range.deleteContents()
        range.insertNode(br)
        range.setStartAfter(br)
      } else {
        // Enter: Create new paragraph
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        range.deleteContents()
        range.insertNode(p)
        range.setStart(p, 0)
      }
      
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      handleInput()
    }
  }

  const minHeight = rows * 1.5

  return (
    <div className={`border border-accent-dark rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="bg-gray-50 border-b border-accent-dark p-3 text-sm text-text-light">
        💡 <strong>Tip:</strong> Paste formatted text directly! Bold, italics, lists, and paragraphs will be preserved. 
        Press <kbd>Enter</kbd> for new paragraph, <kbd>Shift+Enter</kbd> for line break.
      </div>
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
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor