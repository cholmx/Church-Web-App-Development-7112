import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const { FiPlus, FiTrash2, FiCalendar } = FiIcons;

const PRESET_COLORS = [
  { label: 'Deep Teal', value: '#0D2B23' },
  { label: 'Dark Teal', value: '#003B2E' },
  { label: 'Amber', value: '#E8851A' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Slate', value: '#475569' },
  { label: 'Black', value: '#111827' },
];

const sectionContainerClass = "rounded-lg border border-[#D4CFC4] bg-[#F2EFE8] p-6 mb-6";
const sectionTitleClass = "text-[#E8851A] text-[11px] font-bold tracking-[0.15em] uppercase mb-5 font-spartan";
const labelClass = "block text-[#003B2E] text-[10px] font-bold uppercase tracking-wider mb-2 font-google-sans";
const inputClass = "w-full bg-white border border-[#D4CFC4] rounded-md px-3 py-2.5 text-sm text-[#0D2B23] focus:outline-none focus:border-[#E8851A] focus:ring-1 focus:ring-[#E8851A] placeholder-[#AAAA99] font-google-sans transition-shadow";

const SignupSheetBuilder = ({ sheetData, setSheetData, onPreview }) => {
  const updateField = (field, value) => setSheetData(prev => ({ ...prev, [field]: value }));
  const updateRows = (rows) => setSheetData(prev => ({ ...prev, rows: Math.max(1, Math.min(50, rows)) }));
  const toggleDateTime = () => setSheetData(prev => ({ ...prev, showDateTime: !prev.showDateTime }));

  const addColumn = () => {
    if (sheetData.columns.length < 8) {
      const eq = Math.floor(100 / (sheetData.columns.length + 1));
      const rem = 100 - eq * (sheetData.columns.length + 1);
      const cols = sheetData.columns.map((col, i) => ({ ...col, width: eq + (i === 0 ? rem : 0) }));
      cols.push({ name: `Column ${sheetData.columns.length + 1}`, width: eq });
      setSheetData(prev => ({ ...prev, columns: cols }));
    }
  };

  const removeColumn = (index) => {
    if (sheetData.columns.length > 1) {
      const removed = sheetData.columns[index].width;
      const remaining = sheetData.columns.filter((_, i) => i !== index);
      const bonus = Math.floor(removed / remaining.length);
      const extra = removed - bonus * remaining.length;
      const updated = remaining.map((col, i) => ({ ...col, width: col.width + bonus + (i === 0 ? extra : 0) }));
      setSheetData(prev => ({ ...prev, columns: updated }));
    }
  };

  const updateColumnName = (index, name) => {
    setSheetData(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => (i === index ? { ...col, name } : col)),
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E5E1D5' }}>
      {/* Header */}
      <header className="bg-[#0D2B23] pt-6 px-8 flex flex-col gap-6 shadow-sm">
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
              onClick={onPreview}
              className="bg-transparent border border-[#1a4035] bg-[#1a4035] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#E8851A] hover:border-[#E8851A] transition-colors font-google-sans"
            >
              Preview & Print
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 max-w-5xl mx-auto w-full">
          <button className="pb-3 text-sm font-bold uppercase tracking-wider border-b-4 border-[#E8851A] text-[#E8851A] font-google-sans">
            Manage
          </button>
          <button
            onClick={onPreview}
            className="pb-3 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-white/60 hover:text-white transition-colors font-google-sans"
          >
            Preview
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 mt-4 mb-12">
        <div className="bg-white rounded-xl border border-[#D4CFC4] shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="px-8 py-6 border-b border-[#D4CFC4] flex justify-between items-center bg-white">
            <h2 className="text-[#0D2B23] font-bold tracking-widest text-[15px] uppercase font-spartan">
              New Sign-up Sheet
            </h2>
            <div className="text-[11px] text-[#AAA99A] font-google-sans italic">
              Fill in the details below to generate your sheet.
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">

            {/* Intro */}
            <div className="mb-8">
              <div className="bg-[#F2EFE8] border border-[#D4CFC4] rounded-lg p-5 text-sm text-[#555548] font-google-sans mb-6">
                Fill in the title and any details, then configure your columns below. Switch to the <b>Preview</b> tab to print or save as PDF.
              </div>

              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={sheetData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Easter Service Volunteer Sign-up"
                className={inputClass}
              />
            </div>

            {/* Key Details */}
            <div className={sectionContainerClass}>
              <h3 className={sectionTitleClass}>Key Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Additional Instructions (Optional)</label>
                  <textarea
                    value={sheetData.instructions}
                    onChange={(e) => updateField('instructions', e.target.value)}
                    placeholder="Enter any notes, instructions, or contact info to display at the top..."
                    rows="2"
                    className={inputClass + ' resize-none'}
                  />
                </div>
                <div>
                  <label className={labelClass}>Rows Needed</label>
                  <input
                    type="number"
                    value={sheetData.rows}
                    onChange={(e) => updateRows(parseInt(e.target.value) || 20)}
                    min="1"
                    max="50"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Accent Color</label>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        title={c.label}
                        onClick={() => updateField('accentColor', c.value)}
                        className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c.value,
                          border: sheetData.accentColor === c.value ? '2px solid #E8851A' : '1px solid #D4CFC4',
                          boxShadow: sheetData.accentColor === c.value ? '0 0 0 2px #fff inset' : 'none',
                        }}
                      />
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="color"
                        value={sheetData.accentColor}
                        onChange={(e) => updateField('accentColor', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border border-[#D4CFC4] p-0 overflow-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className={sectionContainerClass}>
              <h3 className={sectionTitleClass}>Timing</h3>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <label className={labelClass}>Date & Time Display</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <SafeIcon icon={FiCalendar} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAA99]" />
                      <input
                        type="text"
                        value={sheetData.dateTimeLabel}
                        onChange={(e) => updateField('dateTimeLabel', e.target.value)}
                        placeholder="e.g. Sunday, April 9th @ 8:00 AM"
                        disabled={!sheetData.showDateTime}
                        className={`${inputClass} pl-10 ${!sheetData.showDateTime ? 'opacity-50 bg-[#F2EFE8]' : ''}`}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={sheetData.showDateTime}
                        onChange={toggleDateTime}
                        className="w-4 h-4 rounded border-[#D4CFC4] text-[#E8851A] focus:ring-[#E8851A]"
                        style={{ accentColor: '#E8851A' }}
                      />
                      <span className="text-sm font-google-sans text-[#0D2B23]">Include Date</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Columns Definition */}
            <div className={sectionContainerClass}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`${sectionTitleClass} mb-0`}>Columns Definition</h3>
                <button
                  onClick={addColumn}
                  disabled={sheetData.columns.length >= 8}
                  className="flex items-center gap-1.5 text-[#E8851A] text-[11px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  <SafeIcon icon={FiPlus} className="text-sm" />
                  Add Column
                </button>
              </div>

              <div className="space-y-2">
                {sheetData.columns.map((column, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2.5 rounded border border-[#D4CFC4] bg-white transition-colors"
                  >
                    <span className="w-6 text-center font-bold text-[#003B2E] text-xs opacity-50">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => updateColumnName(index, e.target.value)}
                      placeholder={`Column ${index + 1}`}
                      className="flex-1 px-3 py-1.5 border border-transparent hover:border-[#D4CFC4] focus:border-[#E8851A] rounded focus:outline-none font-google-sans text-sm text-[#0D2B23] transition-colors bg-transparent"
                    />
                    <div className="flex items-center gap-2 min-w-[100px] opacity-70">
                      <span className="text-[10px] font-google-sans w-8 text-right text-[#003B2E] font-bold">
                        {Math.round(column.width)}%
                      </span>
                      <div className="flex-1 h-1.5 rounded-full relative bg-[#D4CFC4]">
                        <div
                          className="h-full rounded-full bg-[#E8851A]"
                          style={{ width: `${column.width}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeColumn(index)}
                      disabled={sheetData.columns.length <= 1}
                      className="p-1.5 rounded text-[#AAAA99] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] font-google-sans text-[#888880]">
                You can drag the column borders directly on the Preview tab to adjust their widths manually.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSheetBuilder;
