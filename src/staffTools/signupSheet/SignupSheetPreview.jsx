import React, { useRef, useState, useCallback } from 'react';
import * as FiIcons from 'react-icons/fi';

const { FiPrinter } = FiIcons;
const MIN_COL_WIDTH = 5;

const SignupSheetPreview = ({ sheetData, setSheetData, onBack }) => {
  const tableRef = useRef(null);
  const resizingRef = useRef(null);
  const [activeHandle, setActiveHandle] = useState(null);

  const handlePrint = () => window.print();
  const isCompact = sheetData.rows > 25;
  const isUltraCompact = sheetData.rows > 40;
  const accent = sheetData.accentColor || '#0D2B23';

  const startResize = useCallback((e, index) => {
    e.preventDefault();
    const tableWidth = tableRef.current?.getBoundingClientRect().width || 1;
    resizingRef.current = { index, startX: e.clientX, tableWidth, startWidths: sheetData.columns.map(c => c.width) };
    setActiveHandle(index);

    const onMove = (moveEvent) => {
      const { index, startX, tableWidth, startWidths } = resizingRef.current;
      const dPct = ((moveEvent.clientX - startX) / tableWidth) * 100;
      let newLeft = startWidths[index] + dPct;
      let newRight = startWidths[index + 1] - dPct;
      if (index + 1 >= startWidths.length) return;
      if (newLeft < MIN_COL_WIDTH) { newRight += newLeft - MIN_COL_WIDTH; newLeft = MIN_COL_WIDTH; }
      if (newRight < MIN_COL_WIDTH) { newLeft += newRight - MIN_COL_WIDTH; newRight = MIN_COL_WIDTH; }
      setSheetData(prev => ({
        ...prev,
        columns: prev.columns.map((col, i) => {
          if (i === index) return { ...col, width: Math.round(newLeft * 10) / 10 };
          if (i === index + 1) return { ...col, width: Math.round(newRight * 10) / 10 };
          return col;
        }),
      }));
    };

    const onUp = () => {
      resizingRef.current = null;
      setActiveHandle(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [sheetData.columns, setSheetData]);

  return (
    <div className="min-h-screen print:bg-white" style={{ backgroundColor: '#F9F9F7' }}>

      {/* Header (Hidden when printing) */}
      <header className="bg-white border-b border-[#E7E2D6] px-8 print:hidden">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <div className="flex gap-8">
            <button
              onClick={onBack}
              className="py-3 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-[#9B9C93] hover:text-[#0B1613] transition-colors"
            >
              Manage
            </button>
            <button className="py-3 text-sm font-bold uppercase tracking-wider border-b-4 border-[#0B1613] text-[#0B1613]">
              Preview
            </button>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#0B1613] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#1B2622] transition-colors"
          >
            <FiPrinter className="text-sm" />
            Print Sheet
          </button>
        </div>
      </header>

      {/* Page Container */}
      <div className="flex justify-center px-4 py-8 print:py-0 print:px-0">
        <div className="signup-sheet-container">
          <div className="signup-sheet-content">

            {/* Header */}
            <div className={`text-center ${isUltraCompact ? 'mb-2' : isCompact ? 'mb-4' : 'mb-6'}`}>
              <h1
                className={`${isUltraCompact ? 'text-2xl' : isCompact ? 'text-3xl' : 'text-4xl'} sheet-title`}
                style={{ color: '#0B1613' }}
              >
                {sheetData.title || 'Sign-up Sheet'}
              </h1>

              {sheetData.showDateTime && sheetData.dateTimeLabel && (
                <div
                  className={`${isUltraCompact ? 'text-base' : 'text-xl'} font-bold mt-1`}
                  style={{ color: '#3F4542' }}
                >
                  {sheetData.dateTimeLabel}
                </div>
              )}

              {sheetData.instructions && (
                <div
                  className={`max-w-3xl mx-auto mt-2 ${isUltraCompact ? 'text-[10px]' : 'text-sm'} whitespace-pre-wrap leading-tight`}
                  style={{ color: '#3F4542' }}
                >
                  {sheetData.instructions}
                </div>
              )}

              {!isUltraCompact && (
                <div
                  className={`w-24 h-1 mx-auto ${isCompact ? 'mt-3' : 'mt-5'}`}
                  style={{ backgroundColor: accent }}
                />
              )}
            </div>

            {/* Table */}
            <div className="sheet-table" ref={tableRef}>
              {/* Header Row */}
              <div className="sheet-header-row" style={{ backgroundColor: '#F1EEE6' }}>
                {sheetData.columns.map((column, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-center px-2 py-1.5 text-center border-r-2 border-black last:border-r-0"
                    style={{ width: `${column.width}%` }}
                  >
                    <span className="column-header text-[11px] leading-tight select-none" style={{ color: '#0B1613' }}>
                      {column.name}
                    </span>
                    {index < sheetData.columns.length - 1 && (
                      <div
                        className={`resize-handle print:hidden ${activeHandle === index ? 'resizing' : ''}`}
                        onMouseDown={(e) => startResize(e, index)}
                        title="Drag to resize"
                        style={{ '--resize-color': accent }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                {Array.from({ length: sheetData.rows }).map((_, rowIndex) => (
                  <div key={rowIndex} className="sheet-row last:border-b-0">
                    {sheetData.columns.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="border-r border-gray-400 last:border-r-0"
                        style={{ width: `${column.width}%` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            {!isUltraCompact && (
              <div className="mt-2 flex justify-end items-end">
                <p className="text-[10px]" style={{ color: '#3F4542' }}>
                  Please print clearly. Thank you!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSheetPreview;