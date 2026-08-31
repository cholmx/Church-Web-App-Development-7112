import React, { useState } from 'react';
import SignupSheetBuilder from './SignupSheetBuilder';
import SignupSheetPreview from './SignupSheetPreview';
import './signupSheet.css';

const defaultColumns = () => {
  const names = ['Name', 'Email', 'Phone'];
  const w = Math.floor(100 / names.length);
  const rem = 100 - w * names.length;
  return names.map((name, i) => ({ name, width: w + (i === 0 ? rem : 0) }));
};

// Ported from Sign-Up-Sheet-App-Design-6580. The standalone app used
// react-router routes (/ and /preview) to switch views; here it's local
// state instead, since this is mounted as one tab inside /admin rather
// than owning its own URL.
export default function SignupSheetMaker() {
  const [view, setView] = useState('builder');
  const [sheetData, setSheetData] = useState({
    title: '',
    showDateTime: true,
    dateTimeLabel: 'Date & Time:',
    instructions: '',
    columns: defaultColumns(),
    rows: 20,
    accentColor: '#0D2B23',
  });

  return (
    <div className="signup-sheet-tool">
      {view === 'builder' ? (
        <SignupSheetBuilder
          sheetData={sheetData}
          setSheetData={setSheetData}
          onPreview={() => setView('preview')}
        />
      ) : (
        <SignupSheetPreview
          sheetData={sheetData}
          setSheetData={setSheetData}
          onBack={() => setView('builder')}
        />
      )}
    </div>
  );
}
