import { useState } from 'react';
import { callAI } from '../lib/ai';
import { formatDateNice } from '../lib/helpers';
import type { Announcement } from '../types';

type FormData = Omit<Announcement, 'id' | 'created_at' | 'updated_at'> & { id?: string };
type Setter = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

const AI_THRESHOLD = 2;

const SYS_BASE = `You are a church communications writer for Upper Room Fellowship. Write in a warm, conversational, plain-spoken tone. No clever transitions or constructed phrases. No em dashes. No greeting-card language. Keep it clear, direct, and human. Write like you're talking to people you know at church on Sunday. Always write so a first-time guest would fully understand, never use acronyms or insider shorthand without explaining them, and never assume the reader knows the building, the programs, or the people. Every announcement exists for one purpose: to move someone toward a next step in their faith and in the life of the church. Lead with why it matters to the reader, a brief, genuine reason to care, before any logistics. Inspiration over information.`;

function buildContext(f: FormData): string {
  const parts = [`Title: ${f.title || '(none yet)'}`];
  if (f.description) parts.push(`Description: ${f.description}`);
  if (f.short_version) parts.push(`Short version: ${f.short_version}`);
  if (f.body) parts.push(`Full description: ${f.body}`);
  if (f.flyer_text) parts.push(`Flyer text: ${f.flyer_text}`);
  if (f.event_dates && f.event_dates.filter(Boolean).length > 0) {
    parts.push(`Event dates: ${f.event_dates.filter(Boolean).sort().map(formatDateNice).join(', ')}`);
  } else if (f.event_date) {
    parts.push(`Event date: ${formatDateNice(f.event_date)}`);
  }
  if (f.category) parts.push(`Category: ${f.category}`);
  if (f.scope) parts.push(`Scope: ${f.scope}`);
  if (f.event_location) parts.push(`Location: ${f.event_location}`);
  if (f.contact_name) parts.push(`Contact: ${f.contact_name}`);
  if (f.contact_info) parts.push(`Contact info: ${f.contact_info}`);
  if (f.stage_notes) parts.push(`Tone notes: ${f.stage_notes}`);
  return parts.join('\n');
}

interface AILoadingState {
  body: boolean;
  slide: boolean;
  flyer: boolean;
  all: boolean;
}

interface UseAnnouncementAIReturn {
  aiLoading: AILoadingState;
  hasEnoughForAI: boolean;
  generateBody: () => Promise<void>;
  generateSlide: () => Promise<void>;
  generateFlyer: () => Promise<void>;
  generateAll: () => Promise<void>;
}

export function useAnnouncementAI(
  f: FormData,
  set: Setter,
  onError: (msg: string) => void,
): UseAnnouncementAIReturn {
  const [aiLoading, setAiLoading] = useState<AILoadingState>({ body: false, slide: false, flyer: false, all: false });

  const hasEnoughForAI = f.title.length > AI_THRESHOLD || f.description.length > AI_THRESHOLD;

  const stripEmDash = (s: string) => s.replace(/\u2014/g, '-').replace(/\u2013/g, '-');

  const generateBody = async () => {
    setAiLoading(p => ({ ...p, body: true }));
    try {
      const result = await callAI(
        SYS_BASE + ` You write church announcement descriptions for a weekly email called "The Happenings." These are 2-4 sentences. Open with a brief, genuine story or human reason why this event matters, what someone will get out of it, why it's worth their time, how it connects to their life or faith. Weave in the practical details (what, when, where) naturally, not as a list. End with one clear, specific action, tell them exactly what to do next.`,
        `Write the full description for this church announcement. Return ONLY the description text, nothing else.\n\n${buildContext(f)}`,
      );
      set('body', stripEmDash(result.trim()));
    } catch (e) {
      onError(e instanceof Error ? e.message : 'AI generation failed');
    } finally {
      setAiLoading(p => ({ ...p, body: false }));
    }
  };

  const generateSlide = async () => {
    setAiLoading(p => ({ ...p, slide: true }));
    try {
      const result = await callAI(
        SYS_BASE + ` You write short one-liner text for a church pre-service slide. It must be a single phrase, not a full sentence, no subject, no verb, just the essential details someone needs to know at a glance. Normal sentence case (capitalize only the first word and proper nouns). No pipe characters. No em dashes. Include only: event name, date(s), time, and location if helpful. If multiple dates, list them with " + ". Keep it under 12 words total. Think billboard, not sentence. Example: "Men's Bible Study, May 6 + May 20, 7 PM, Fellowship Hall"`,
        `Write the slide/short text for this announcement. Return ONLY the text line, nothing else.\n\n${buildContext(f)}`,
      );
      const clean = stripEmDash(result.trim()).replace(/^["']|["']$/g, '');
      set('slide_override', clean);
      set('short_version', clean);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'AI generation failed');
    } finally {
      setAiLoading(p => ({ ...p, slide: false }));
    }
  };

  const generateFlyer = async () => {
    setAiLoading(p => ({ ...p, flyer: true }));
    try {
      const result = await callAI(
        SYS_BASE + ` You write flyer copy for a monthly printed church bulletin. This must be exactly 1-2 short sentences, maximum 40 words total. Be tight and punchy, much shorter than the email description. One sentence on what makes it worth showing up for, one sentence with the key practical detail or next step. No flowery language. No filler. Every word must earn its place on a printed page.`,
        `Write the monthly flyer text for this announcement. Return ONLY the text, nothing else.\n\n${buildContext(f)}`,
      );
      set('flyer_text', stripEmDash(result.trim()));
    } catch (e) {
      onError(e instanceof Error ? e.message : 'AI generation failed');
    } finally {
      setAiLoading(p => ({ ...p, flyer: false }));
    }
  };

  const generateAll = async () => {
    if (!f.title) return;
    setAiLoading({ body: true, slide: true, flyer: true, all: true });
    try {
      const result = await callAI(
        SYS_BASE + ` You help write all versions of a church announcement at once. Return a JSON object with three keys: "body" (2-4 sentence weekly email description, open with a brief human reason why it matters, weave in practical details naturally, end with one clear action step), "slide" (a single short phrase, not a full sentence, in normal sentence case, no pipe characters, under 12 words; include only event name, dates, time, and location, think billboard, not sentence), and "flyer" (1-2 short sentences, max 40 words, for a printed monthly bulletin; one sentence on why it matters, one on the key detail or next step; tight and punchy). Return ONLY valid JSON. No markdown backticks. No extra text.`,
        `Write all versions for this announcement:\n\n${buildContext(f)}`,
      );
      const sd = (s: string) => stripEmDash(s);
      try {
        const cleaned = result.trim().replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.body) set('body', sd(parsed.body));
        if (parsed.slide) {
          const slideClean = sd(parsed.slide.replace(/^["']|["']$/g, ''));
          set('slide_override', slideClean);
          set('short_version', slideClean);
        }
        if (parsed.flyer) set('flyer_text', sd(parsed.flyer));
      } catch {
        if (result.trim()) set('body', result.trim());
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : 'AI generation failed');
    } finally {
      setAiLoading({ body: false, slide: false, flyer: false, all: false });
    }
  };

  return { aiLoading, hasEnoughForAI, generateBody, generateSlide, generateFlyer, generateAll };
}
