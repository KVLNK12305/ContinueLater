import React, { useState, useMemo } from 'react';
import { useLearningItems } from '../../hooks/useLearningItems';
import { generateMarkdownDigest } from '../../utils/resume';
import { formatRemainingTime } from '../../utils/time';
import { Sparkles, Clock, Layers, Copy, Check, Play, BookOpen, Flame } from 'lucide-react';

type SlotKey = 'quick' | 'medium' | 'deep';

interface TimeSlotOption {
  key: SlotKey;
  label: string;
  tag: string;
  filter: (mins: number) => boolean;
}

const TIME_SLOTS: TimeSlotOption[] = [
  { key: 'quick', label: '⚡ < 15 min', tag: 'Quick Win', filter: (m) => m <= 15 },
  { key: 'medium', label: '☕ 15–30 min', tag: 'Standard Focus', filter: (m) => m > 15 && m <= 30 },
  { key: 'deep', label: '🚀 30+ min', tag: 'Deep Dive', filter: (m) => m >= 30 }
];

export const AIPreview: React.FC = () => {
  const { items, resumeItem } = useLearningItems();
  const [selectedSlotKey, setSelectedSlotKey] = useState<SlotKey | null>(null);
  const [copied, setCopied] = useState(false);

  const unfinishedItems = useMemo(() => {
    return items.filter((i) => i.status === 'unfinished' || i.status === 'snoozed');
  }, [items]);

  // Recommendation logic based on user's available time slot
  const recommendationData = useMemo(() => {
    if (unfinishedItems.length === 0) return null;

    if (!selectedSlotKey) {
      // Default: Quickest win (lowest remaining time)
      const sorted = [...unfinishedItems].sort((a, b) => a.estimatedRemainingMinutes - b.estimatedRemainingMinutes);
      return {
        item: sorted[0],
        isExactMatch: true,
        tag: 'Quickest Win',
        note: 'Quickest session to complete in your backlog'
      };
    }

    const slot = TIME_SLOTS.find((s) => s.key === selectedSlotKey);
    if (!slot) return null;

    const matched = unfinishedItems.filter((i) => slot.filter(i.estimatedRemainingMinutes || 5));
    if (matched.length > 0) {
      if (selectedSlotKey === 'deep') {
        // For deep dive, pick longest or highest progress
        matched.sort((a, b) => b.estimatedRemainingMinutes - a.estimatedRemainingMinutes);
      } else {
        matched.sort((a, b) => b.estimatedRemainingMinutes - a.estimatedRemainingMinutes);
      }
      return {
        item: matched[0],
        isExactMatch: true,
        tag: slot.tag,
        note: `Ideal session for your ${slot.label} time window`
      };
    }

    // Fallback if no sessions match the exact range
    if (selectedSlotKey === 'deep') {
      const longest = [...unfinishedItems].sort((a, b) => b.estimatedRemainingMinutes - a.estimatedRemainingMinutes)[0];
      return {
        item: longest,
        isExactMatch: false,
        tag: 'Longest Available',
        note: `No 30+ min sessions found. Showing longest available (${formatRemainingTime(longest.estimatedRemainingMinutes)})`
      };
    }

    const shortest = [...unfinishedItems].sort((a, b) => a.estimatedRemainingMinutes - b.estimatedRemainingMinutes)[0];
    return {
      item: shortest,
      isExactMatch: false,
      tag: 'Closest Match',
      note: `No sessions found in ${slot.label}. Showing closest session (${formatRemainingTime(shortest.estimatedRemainingMinutes)})`
    };
  }, [unfinishedItems, selectedSlotKey]);

  // Topic clustering
  const topicClusters = useMemo(() => {
    const clusters: Record<string, typeof unfinishedItems> = {};
    unfinishedItems.forEach((item) => {
      let key = 'General Reading';
      if (item.source === 'youtube') key = 'Video & Podcasts';
      else if (item.source === 'github') key = 'Code & Repositories';
      else if (item.source === 'substack') key = 'Newsletters';
      else if (item.source === 'pdf') key = 'Papers & PDFs';
      else if (item.source === 'wikipedia' || item.source === 'google-search') key = 'Research & Notes';
      else if (item.source === 'medium' || item.source === 'devto' || item.source === 'hashnode') key = 'Engineering Articles';

      if (!clusters[key]) clusters[key] = [];
      clusters[key].push(item);
    });
    return Object.entries(clusters);
  }, [unfinishedItems]);

  const handleCopyDigest = async () => {
    const md = generateMarkdownDigest(items);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalRemainingMinutes = useMemo(() => {
    return unfinishedItems.reduce((acc, i) => acc + (i.estimatedRemainingMinutes || 5), 0);
  }, [unfinishedItems]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto', paddingRight: '4px' }}>
      {/* Header */}
      <div style={{ padding: '0 4px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--nm-text-primary)' }}>
          <Sparkles size={18} color="var(--nm-accent)" />
          Smart Flow Intelligence
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
          Intelligent session prioritization, topic clustering, and Notion-ready continuity digests
        </p>
      </div>

      {/* Overview Stat Strip */}
      <div
        className="nm-card animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--nm-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--nm-accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Flame size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontWeight: 600 }}>Active Backlog</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
              {unfinishedItems.length} sessions · {(totalRemainingMinutes / 60).toFixed(1)} hrs left
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyDigest}
          className="nm-btn nm-btn-primary"
          style={{ fontSize: '11px', padding: '6px 12px', gap: '6px' }}
          title="Export Markdown table for Notion or Obsidian"
        >
          {copied ? <Check size={13} color="var(--nm-success)" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Export Digest'}
        </button>
      </div>

      {/* Available Time Slot Recommender */}
      <div className="nm-card animate-fade-in" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nm-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--nm-accent)" /> What should I resume next?
          </span>
          <span style={{ fontSize: '10px', color: 'var(--nm-text-secondary)' }}>Select available time</span>
        </div>

        {/* Time chips */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlotKey === slot.key;
            return (
              <button
                key={slot.key}
                onClick={() => setSelectedSlotKey(isSelected ? null : slot.key)}
                className={`nm-chip ${isSelected ? 'nm-chip-active' : ''}`}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  justifyContent: 'center'
                }}
              >
                {slot.label}
              </button>
            );
          })}
        </div>

        {/* Recommended Card */}
        {recommendationData ? (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--nm-radius-sm)',
              background: 'var(--nm-bg-elevated)',
              boxShadow: 'inset 2px 2px 4px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--nm-accent)', textTransform: 'uppercase' }}>
                    {recommendationData.tag} ({recommendationData.item.source})
                  </span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--nm-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                  {recommendationData.item.title}
                </h4>
                <p style={{ fontSize: '10px', color: 'var(--nm-text-secondary)', marginTop: '2px' }}>
                  {recommendationData.item.completionPercent}% done · {formatRemainingTime(recommendationData.item.estimatedRemainingMinutes)}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--nm-accent)', fontStyle: 'italic', marginTop: '2px' }}>
                  {recommendationData.note}
                </p>
              </div>

              <button
                onClick={() => resumeItem(recommendationData.item)}
                className="nm-btn nm-btn-primary"
                style={{ fontSize: '11px', padding: '6px 12px', flexShrink: 0 }}
              >
                <Play size={10} fill="currentColor" /> Resume
              </button>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>
            No unfinished sessions found. Start learning to get recommendations!
          </div>
        )}
      </div>

      {/* Topic Stacks / Clusters */}
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--nm-text-primary)', display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px' }}>
          <Layers size={14} color="var(--nm-accent)" /> Knowledge Topic Stacks
        </h3>

        {topicClusters.length > 0 ? (
          topicClusters.map(([clusterName, clusterItems]) => {
            const clusterMins = clusterItems.reduce((acc, i) => acc + (i.estimatedRemainingMinutes || 5), 0);
            return (
              <div
                key={clusterName}
                className="nm-card nm-card-interactive"
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--nm-bg)',
                      boxShadow: 'inset 2px 2px 4px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--nm-accent)'
                    }}
                  >
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nm-text-primary)' }}>
                      {clusterName}
                    </h4>
                    <p style={{ fontSize: '10px', color: 'var(--nm-text-secondary)', marginTop: '2px' }}>
                      {clusterItems.length} sessions · {clusterMins} min total
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => resumeItem(clusterItems[0])}
                  className="nm-btn nm-btn-secondary"
                  style={{ fontSize: '10px', padding: '4px 10px' }}
                  title="Resume top session in this stack"
                >
                  <Play size={9} fill="currentColor" /> Open Top
                </button>
              </div>
            );
          })
        ) : (
          <div style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', padding: '8px 4px' }}>
            Browse YouTube, GitHub, Medium, or newsletters to generate topic stacks.
          </div>
        )}
      </div>
    </div>
  );
};
