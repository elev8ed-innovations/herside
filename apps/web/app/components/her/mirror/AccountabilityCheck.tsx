'use client';

import { useState } from 'react';
import type { Phase } from '@herside/shared';

const LOCAL_RESPONSES: Record<'yes' | 'somewhat' | 'not_really', string> = {
  yes:        'That awareness is the practice. Each time you choose it, it gets easier.',
  somewhat:   'Partial is still progress. Notice where the gap was — that\'s the data.',
  not_really: 'This is information, not verdict. Tomorrow is a new window.',
};

const QUESTIONS = [
  { id: 'communicated_needs', text: 'Did you communicate what you actually needed today?' },
  { id: 'recognized_biology', text: 'Did you recognize when your biology was influencing your reactions?' },
  { id: 'gave_space',         text: 'Did you give someone space when you felt reactive?' },
  { id: 'reached_out',        text: 'Did you reach out when you needed support?' },
];

const ANSWERS = [
  { type: 'yes' as const,        label: 'Yes, I did',   color: '#5BAA78' },
  { type: 'somewhat' as const,   label: 'Somewhat',     color: '#D09040' },
  { type: 'not_really' as const, label: 'Not today',    color: 'rgba(240,232,236,0.3)' },
];

interface QuestionState {
  selected: 'yes' | 'somewhat' | 'not_really' | null;
  response: string;
  loading: boolean;
}

interface AccountabilityCheckProps {
  phase: Phase;
  cycleDay: number;
  phaseColor: string;
}

export function AccountabilityCheck({ phase, cycleDay, phaseColor }: AccountabilityCheckProps) {
  const [states, setStates] = useState<Record<string, QuestionState>>(
    Object.fromEntries(QUESTIONS.map(q => [q.id, { selected: null, response: '', loading: false }])),
  );
  const handleSelect = (
    questionId: string,
    _question: string,
    answerType: 'yes' | 'somewhat' | 'not_really',
    _answerLabel: string,
  ) => {
    if (states[questionId].selected === answerType) return;
    setStates(prev => ({
      ...prev,
      [questionId]: { selected: answerType, response: LOCAL_RESPONSES[answerType], loading: false },
    }));
  };

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(240,232,236,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
        <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
          Daily Accountability Check
        </span>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {QUESTIONS.map((q, i) => {
          const s = states[q.id];
          return (
            <div key={q.id}>
              {/* Question */}
              <p style={{
                color: 'rgba(240,232,236,0.7)',
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                lineHeight: 1.5,
                margin: '0 0 10px',
              }}>
                {q.text}
              </p>

              {/* Answer buttons */}
              <div style={{ display: 'flex', gap: 6 }}>
                {ANSWERS.map(answer => {
                  const active = s.selected === answer.type;
                  return (
                    <button
                      key={answer.type}
                      onClick={() => handleSelect(q.id, q.text, answer.type, answer.label)}
                      style={{
                        flex: 1,
                        padding: '7px 4px',
                        borderRadius: 50,
                        border: active
                          ? `1px solid ${answer.color}`
                          : '1px solid rgba(240,232,236,0.09)',
                        background: active ? `${answer.color}18` : 'transparent',
                        color: active ? answer.color : 'rgba(240,232,236,0.35)',
                        fontSize: 11,
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: active ? 500 : 400,
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {answer.label}
                    </button>
                  );
                })}
              </div>

              {/* AI response */}
              {(s.loading || s.response) && (
                <div style={{
                  marginTop: 10,
                  padding: '10px 14px',
                  background: `${phaseColor}0A`,
                  borderLeft: `2px solid ${phaseColor}50`,
                  borderRadius: '0 10px 10px 0',
                }}>
                  {s.loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[90, 70].map(w => (
                        <div key={w} style={{
                          height: 10,
                          width: `${w}%`,
                          borderRadius: 5,
                          background: 'rgba(240,232,236,0.06)',
                          animation: 'pulse-bg 2s ease-in-out infinite',
                        }} />
                      ))}
                    </div>
                  ) : (
                    <p style={{
                      color: 'rgba(240,232,236,0.65)',
                      fontSize: 12,
                      fontFamily: 'DM Sans, sans-serif',
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      {s.response}
                    </p>
                  )}
                </div>
              )}

              {/* Divider between questions */}
              {i < QUESTIONS.length - 1 && (
                <div style={{ height: 1, background: 'rgba(240,232,236,0.04)', marginTop: 20 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
