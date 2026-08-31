export const CATEGORIES = [
  'Worship & Services',
  'Groups & Classes',
  'Outreach & Missions',
  'Youth & Kids',
  'Events & Fellowship',
  'Building & Facilities',
  'General Info',
] as const;

export const SCOPE_OPTIONS = [
  { value: 'whole_church', label: 'Whole Church', desc: 'Everyone needs to know' },
  { value: 'ministry', label: 'Ministry Specific', desc: 'Relevant to a group or ministry' },
  { value: 'informational', label: 'Informational', desc: 'Good to know, low urgency' },
] as const;

export const MINISTRY_OPTIONS = [
  'Men',
  'Women',
  'Youth',
  'Parents',
  'Children',
] as const;

export const TABS = [
  { key: 'manage', label: 'Manage' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'outputs', label: 'Outputs' },
  { key: 'archive', label: 'Archive' },
] as const;

export const OUTPUT_TABS = [
  { key: 'stage', label: 'Stage Script' },
  { key: 'slides', label: 'Sunday Slides' },
  { key: 'happenings', label: 'The Happenings' },
  { key: 'monthly', label: 'Monthly Flyer' },
  { key: 'weekly', label: 'Weekly Bulletin' },
] as const;

export const DEFAULT_ANNOUNCEMENT = {
  title: '',
  description: '',
  body: '',
  short_version: '',
  category: 'General Info',
  scope: 'ministry' as const,
  event_date: null as string | null,
  event_dates: [] as string[],
  event_time: '',
  is_recurring: false,
  slides_lead_weeks: 3,
  happenings_start_date: null as string | null,
  happenings_end_date: null as string | null,
  monthly_include: false,
  show_on_slides: true,
  show_in_happenings: true,
  event_location: '',
  contact_name: '',
  contact_info: '',
  slide_override: '',
  month_override: '',
  flyer_text: '',
  stage_notes: '',
  needs_signup: false,
  slide_made: false,
  status: 'draft' as const,
  assigned_to: '',
  ministry: '',
  recurrence_type: 'one_time' as const,
  recurrence_day: '',
  recurrence_end_date: null as string | null,
  recurrence_label: '',
};
