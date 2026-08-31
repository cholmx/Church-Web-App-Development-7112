import { useState, useEffect } from 'react';
import { C, font } from '../../lib/theme';
import { btnGhost, btnPrimary } from '../ui/inputs';
import { isHappeningsActive, formatDateNice } from '../../lib/helpers';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { callAI } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { Radio } from 'lucide-react';
import type { Announcement } from '../../types';

interface HappeningsTabProps {
  announcements: Announcement[];
  today: string;
}

function buildRawUpdateData(allItems: Announcement[], today: string): string {
  let t = `Week of ${formatDateNice(today)}\n\n`;
  allItems.forEach(a => {
    const blurb = (a.short_version || a.body || '').trim();
    t += `Title: ${a.title}\n`;
    if (blurb) t += `Details: ${blurb}\n`;
    if (a.event_date) t += `Date: ${formatDateNice(a.event_date)}\n`;
    if (a.contact_name || a.contact_info) {
      t += `Contact: ${[a.contact_name, a.contact_info].filter(Boolean).join(' | ')}\n`;
    }
    t += '\n';
  });
  return t;
}

const SYS_PROMPT = `You are writing a weekly email called "The Happenings" for Upper Room Fellowship. Write it as a friendly, straightforward note from someone at the church, personal and direct, not overly enthusiastic. This is not a list of events. Move from one thing to the next the way a person would in conversation. Say each thing directly, never set up or pre-announce what you are about to say, just say it. Write so that anyone reading it, including someone who has never been to the church, understands what's happening. When mentioning dates, always use the actual date (like "Saturday, July 12"). Never use relative terms like "tomorrow", "this weekend", "next week", or "in a few days", you do not know when this email will be read. No acronyms. No insider language. No assumed knowledge of the building or programs. No bullet points. No lists. No em dashes. No colons. No headers. Plain sentences. Write like people actually talk. End with a brief closer and point people to urf.life for the full list. Write ONLY the email body text. No subject line. No extra commentary.`;

export function HappeningsTab({ announcements, today }: HappeningsTabProps) {
  const [script, setScript] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loadingScript, setLoadingScript] = useState(true);
  const [aiError, setAiError] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const active = announcements.filter(a => isHappeningsActive(a, today));
  const grouped: Record<string, Announcement[]> = {};
  active.forEach(a => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });

  useEffect(() => {
    setScript('');
    setLoadingScript(true);
    supabase
      .from('staff_generated_scripts_portal123')
      .select('content')
      .eq('type', 'happenings')
      .eq('week_date', today)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setScript(data.content);
        setLoadingScript(false);
      });
  }, [today]);

  const saveScript = async (content: string) => {
    await supabase.from('staff_generated_scripts_portal123').upsert(
      { type: 'happenings', week_date: today, content },
      { onConflict: 'type,week_date,user_id' },
    );
  };

  const handleGenerate = async () => {
    const allItems = Object.values(grouped).flat();
    setGenerating(true);
    setAiError('');
    try {
      if (allItems.length === 0) {
        const fallback = `Nothing officially scheduled this week, but we'd still love to see you. Check urf.life for anything that might come up.`;
        setScript(fallback);
        await saveScript(fallback);
        return;
      }
      const rawData = buildRawUpdateData(allItems, today);
      const result = await callAI(
        SYS_PROMPT,
        `Here are the announcements for this week. Write the Happenings email script:\n\n${rawData}`,
      );
      const text = result.trim() || 'Could not generate script.';
      setScript(text);
      await saveScript(text);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            The Happenings
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, margin: 0, letterSpacing: '0.03em' }}>
              {active.length} items · week of {formatDateNice(today)}
            </p>
            {script && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: font.mono,
                fontSize: 10,
                fontWeight: 600,
                color: C.success,
                background: C.successBg,
                border: `1px solid ${C.success}30`,
                borderRadius: 999,
                padding: '2px 8px',
                letterSpacing: '0.04em',
              }}>
                <Radio size={10} strokeWidth={2.5} />
                Live on urf.life
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {script && !generating && (
            <button
              onClick={() => copy(script)}
              style={{ ...btnGhost, fontSize: 12, padding: '7px 14px', color: copied ? C.accent : C.textSec }}
            >
              {copied ? 'Copied!' : 'Copy Script'}
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              ...btnPrimary,
              fontSize: 12,
              padding: '7px 16px',
              opacity: generating ? 0.7 : 1,
              cursor: generating ? 'wait' : 'pointer',
            }}
          >
            {generating ? 'Writing...' : script ? 'Regenerate Script' : 'Generate Script'}
          </button>
        </div>
      </div>

      {aiError && (
        <p style={{ fontFamily: font.body, fontSize: 13, color: C.warn, marginBottom: 12 }}>
          {aiError}
        </p>
      )}

      {loadingScript ? (
        <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: font.body, fontSize: 13, color: C.textMuted }}>
          Loading...
        </div>
      ) : script ? (
        <div style={{
          background: C.stageBg,
          borderRadius: 10,
          padding: '32px 36px',
        }}>
          <pre style={{
            fontFamily: font.body,
            fontSize: 15,
            lineHeight: 1.8,
            color: C.stageText,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}>
            {script}
          </pre>
        </div>
      ) : (
        <div style={{
          padding: '56px 24px',
          textAlign: 'center',
          border: `2px dashed ${C.border}`,
          borderRadius: 10,
          background: C.bgSubtle,
        }}>
          <p style={{ fontFamily: font.display, fontSize: 15, fontWeight: 700, color: C.textSec, margin: '0 0 6px' }}>
            No script yet for this week
          </p>
          <p style={{ fontFamily: font.body, fontSize: 13, color: C.textTer, margin: 0 }}>
            Press "Generate Script" to write this week's Happenings email.
          </p>
        </div>
      )}
    </div>
  );
}
