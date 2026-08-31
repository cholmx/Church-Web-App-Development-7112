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
    <div className="min-h-screen print:bg-white" style={{ backgroundColor: '#E5E1D5' }}>

      {/* Header (Hidden when printing) */}
      <header className="bg-[#0D2B23] pt-6 px-8 flex flex-col gap-6 shadow-sm print:hidden">
        <div className="flex justify-between items-start max-w-5xl mx-auto w-full">
          <div>
            <div className="text-[#E8851A] text-[10px] font-bold tracking-widest uppercase mb-1 font-google-sans">
              Printable Resources
            </div>
            <h1 className="text-white text-2xl font-black tracking-wide uppercase font-spartan">
              Sign-up Sheet Organizer
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#E8851A] border border-[#E8851A] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#d07612] transition-colors font-google-sans shadow-md"
            >
              <FiPrinter className="text-sm" />
              Print Sheet
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 max-w-5xl mx-auto w-full">
          <button
            onClick={onBack}
            className="pb-3 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-white/60 hover:text-white transition-colors font-google-sans"
          >
            Manage
          </button>
          <button className="pb-3 text-sm font-bold uppercase tracking-wider border-b-4 border-[#E8851A] text-[#E8851A] font-google-sans">
            Preview
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
                style={{ color: '#0D2B23' }}
              >
                {sheetData.title || 'Sign-up Sheet'}
              </h1>

              {sheetData.showDateTime && sheetData.dateTimeLabel && (
                <div
                  className={`${isUltraCompact ? 'text-base' : 'text-xl'} font-bold mt-1 font-google-sans`}
                  style={{ color: '#1a3a2e' }}
                >
                  {sheetData.dateTimeLabel}
                </div>
              )}

              {sheetData.instructions && (
                <div
                  className={`max-w-3xl mx-auto mt-2 ${isUltraCompact ? 'text-[10px]' : 'text-sm'} whitespace-pre-wrap leading-tight font-google-sans`}
                  style={{ color: '#1a3a2e' }}
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
              <div className="sheet-header-row" style={{ backgroundColor: '#f0ede8' }}>
                {sheetData.columns.map((column, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-center px-2 py-1.5 text-center border-r-2 border-black last:border-r-0"
                    style={{ width: `${column.width}%` }}
                  >
                    <span className="column-header text-[11px] leading-tight select-none" style={{ color: '#0D2B23' }}>
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
                <p className="text-[10px] font-google-sans" style={{ color: '#1a3a2e' }}>
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