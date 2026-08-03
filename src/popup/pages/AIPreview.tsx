import React from 'react';
import { AIFeatureCard } from '../../components/AIFeatureCard';
import { Sparkles } from 'lucide-react';

export const AIPreview: React.FC = () => {
  const aiFeatures = [
    {
      title: 'Contextual Resume Summary',
      description: 'Generates a 3-bullet summary of where you stopped and the exact key concept you were reviewing when you left.',
      previewSnippet: 'AI: "You were at min 14:20 reviewing Transformer Attention Mechanisms before pausing."'
    },
    {
      title: 'Smart Learning Playlists',
      description: 'Intelligently groups unfinished articles, podcasts, and GitHub repos into structured 30-minute learning playlists.',
      previewSnippet: 'Playlist: "LLM Agents Architecture — 3 items, 28 min total"'
    },
    {
      title: 'Topic Clustering & Knowledge Graph',
      description: 'Clusters related unfinished content across YouTube, Medium, and PDFs into coherent knowledge topic trees.',
      previewSnippet: 'Cluster: [System Design] → 4 items (Medium + YouTube)'
    },
    {
      title: 'Effort Estimation & Next Recommendation',
      description: 'Predicts exact cognitive effort required and recommends which session to resume based on your available time slot.',
      previewSnippet: 'Recommendation: "You have 15 mins before lunch — read Substack newsletter (12 min remaining)"'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto', paddingRight: '4px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 className="display-font painted-text-accent" style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="painted-glow"><Sparkles size={20} color="var(--color-moon-yellow)" /></div>
          Google Labs AI
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
          Interface mockups for next-generation local AI features
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {aiFeatures.map((feat, idx) => (
          <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <AIFeatureCard
              title={feat.title}
              description={feat.description}
              previewSnippet={feat.previewSnippet}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
