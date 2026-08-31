import { useState, useEffect, lazy, Suspense } from 'react';
import { C, font } from './lib/theme';
import { supabase } from './lib/supabase';
import { TabBar } from './components/TabBar';
import { ErrorToastContainer, useErrorToast } from './components/ui/ErrorToast';
import { getAutoHappeningsStartDate, getAutoHappeningsEndDate, isArchived } from './lib/helpers';
import type { Announcement, Tab } from './types';

const ManageTab     = lazy(() => import('./components/manage/ManageTab').then(m => ({ default: m.ManageTab })));
const ArchiveTab    = lazy(() => import('./components/archive/ArchiveTab').then(m => ({ default: m.ArchiveTab })));
const CalendarTab   = lazy(() => import('./components/calendar/CalendarTab').then(m => ({ default: m.CalendarTab })));
const OutputsTab    = lazy(() => import('./components/outputs/OutputsTab').then(m => ({ default: m.OutputsTab })));

function TabFallback() {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: font.body, color: C.textTer, fontSize: 13 }}>
      Loading...
    </div>
  );
}

// Ported from the standalone URFCommunication app. Auth is no longer handled
// here - this is mounted as a tab inside the church site's /admin panel,
// which already gates the whole page on the shared admin session.
export default function StaffCommsApp() {
  const [tab, setTab] = useState<Tab>('manage');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | 'new' | null>(null);
  const [copySource, setCopySource] = useState<Omit<Announcement, 'id' | 'created_at' | 'updated_at'> | null>(null);
  const [today, setToday] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const { toasts, showError, dismissToast } = useErrorToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('staff_announcements_portal123')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showError('Failed to load announcements.');
    else if (data) setAnnouncements(data as Announcement[]);
    setLoading(false);
  };

  const handleSave = async (f: Omit<Announcement, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showError('Session expired. Please sign back in.');
      return;
    }
    const announcementLike = { ...f, id: f.id ?? '' } as Announcement;
    const payload = {
      title: f.title,
      body: f.body,
      description: f.description,
      short_version: f.short_version,
      category: f.category,
      scope: f.scope,
      event_date: f.event_date || null,
      event_time: f.event_time || null,
      is_recurring: f.is_recurring,
      slides_lead_weeks: f.slides_lead_weeks,
      happenings_start_date: getAutoHappeningsStartDate(announcementLike, today),
      happenings_end_date: getAutoHappeningsEndDate(announcementLike),
      monthly_include: f.monthly_include,
      show_on_slides: f.show_on_slides,
      show_in_happenings: f.show_in_happenings,
      contact_name: f.contact_name,
      contact_info: f.contact_info,
      slide_override: f.slide_override,
      month_override: f.month_override,
      flyer_text: f.flyer_text,
      stage_notes: f.stage_notes,
      needs_signup: f.needs_signup,
      event_location: f.event_location,
      event_dates: f.event_dates,
      slide_made: f.slide_made,
      status: f.status,
      assigned_to: f.assigned_to,
      ministry: f.scope === 'ministry' ? (f.ministry || '') : '',
      recurrence_type: f.recurrence_type || 'one_time',
      recurrence_day: f.recurrence_day || '',
      recurrence_end_date: f.recurrence_end_date || null,
      recurrence_label: f.recurrence_label || '',
    };

    if (f.id && f.id !== 'new') {
      const { error } = await supabase
        .from('staff_announcements_portal123')
        .update(payload)
        .eq('id', f.id);
      if (error) showError(`Failed to save announcement: ${error.message}`);
      else setAnnouncements(prev => prev.map(a => a.id === f.id ? { ...a, ...payload } : a));
    } else {
      const { data, error } = await supabase
        .from('staff_announcements_portal123')
        .insert(payload)
        .select()
        .single();
      if (error) showError(`Failed to create announcement: ${error.message}`);
      else if (data) setAnnouncements(prev => [data as Announcement, ...prev]);
    }
  };

  const handleCopyFromArchive = (a: Announcement) => {
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = a;
    setCopySource({
      ...rest,
      event_date: null,
      event_dates: [],
      happenings_start_date: null,
      happenings_end_date: null,
      slide_made: false,
      status: 'draft',
    });
    setEditing('new');
    setTab('manage');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('staff_announcements_portal123').delete().eq('id', id);
    if (error) showError('Failed to delete announcement.');
    else setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleSlideMade = async (id: string, value: boolean) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, slide_made: value } : a));
    const { error } = await supabase.from('staff_announcements_portal123').update({ slide_made: value }).eq('id', id);
    if (error) {
      showError('Failed to update slide status.');
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, slide_made: !value } : a));
    }
  };

  const handleApprove = async (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    const { error } = await supabase.from('staff_announcements_portal123').update({ status: 'approved' }).eq('id', id);
    if (error) {
      showError('Failed to approve announcement.');
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: 'draft' } : a));
    }
  };

  const activeAnnouncements = announcements.filter(a => !isArchived(a, today));
  const archivedAnnouncements = announcements.filter(a => isArchived(a, today));

  return (
    <div className="staff-comms-app">
      <style>{`
        .staff-comms-app, .staff-comms-app *, .staff-comms-app *::before, .staff-comms-app *::after { box-sizing: border-box; }
        @keyframes slideInToast { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .staff-comms-app input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
        .staff-comms-app select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%2394A3B8' d='M5 7L0 2h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px !important; }
        .staff-comms-app textarea { font-family: inherit; }
        .staff-comms-app button { font-family: inherit; }
        .staff-comms-app ::-webkit-scrollbar { width: 5px; height: 5px; }
        .staff-comms-app ::-webkit-scrollbar-track { background: transparent; }
        .staff-comms-app ::-webkit-scrollbar-thumb { background: ${C.borderMed}; border-radius: 99px; }
        .staff-comms-app input:focus, .staff-comms-app select:focus, .staff-comms-app textarea:focus { outline: none; border-color: ${C.borderFocus} !important; box-shadow: 0 0 0 3px ${C.borderFocus}1A; }
        .staff-comms-app .tab-bar { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .staff-comms-app .tab-bar::-webkit-scrollbar { display: none; }
        .staff-comms-app .nav-preview-label { display: inline; }
        @keyframes slideDownDrawer { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .staff-comms-app .mobile-drawer { animation: slideDownDrawer 0.15s ease-out; }
        .staff-comms-app .tab-bar-desktop { display: flex !important; }
        .staff-comms-app .tab-bar-mobile { display: none !important; }
        @media (max-width: 640px) {
          .staff-comms-app .nav-preview-label { display: none; }
          .staff-comms-app .tab-bar-desktop { display: none !important; }
          .staff-comms-app .tab-bar-mobile { display: flex !important; }
        }
      `}</style>

      <div style={{ fontFamily: font.body, background: C.bg, minHeight: '100vh', borderRadius: 16, overflow: 'hidden' }}>
        <header style={{ background: C.navBg, position: 'sticky', top: 0, zIndex: 40, isolation: 'isolate' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TabBar active={tab} onChange={setTab} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '8px 0' }}>
              <span className="nav-preview-label" style={{ fontFamily: font.mono, fontSize: 10, color: 'rgba(241,245,249,0.3)', letterSpacing: '0.05em' }}>preview</span>
              <input
                type="date"
                value={today}
                onChange={e => setToday(e.target.value)}
                style={{
                  padding: '5px 7px',
                  border: '1px solid rgba(241,245,249,0.12)',
                  borderRadius: 5,
                  fontFamily: font.mono,
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'rgba(241,245,249,0.7)',
                  background: 'rgba(255,255,255,0.06)',
                  outline: 'none',
                  colorScheme: 'dark',
                  cursor: 'pointer',
                  maxWidth: 130,
                }}
              />
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 64px' }}>
          <Suspense fallback={<TabFallback />}>
            {tab === 'manage' && (
              <ManageTab
                announcements={activeAnnouncements}
                today={today}
                onSave={handleSave}
                onDelete={handleDelete}
                onApprove={handleApprove}
                editing={editing}
                setEditing={setEditing}
                copySource={copySource}
                setCopySource={setCopySource}
                loading={loading}
                onError={showError}
              />
            )}
            {tab === 'calendar' && (
              <CalendarTab
                announcements={activeAnnouncements}
                today={today}
                onSave={handleSave}
                onDelete={handleDelete}
                onPreviewDateChange={setToday}
                onError={showError}
              />
            )}
            {tab === 'outputs' && (
              <OutputsTab
                announcements={activeAnnouncements}
                today={today}
                onToggleSlideMade={handleToggleSlideMade}
                onError={showError}
              />
            )}
            {tab === 'archive' && (
              <ArchiveTab announcements={archivedAnnouncements} onDelete={handleDelete} onCopy={handleCopyFromArchive} />
            )}
          </Suspense>
        </div>
      </div>

      <ErrorToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
