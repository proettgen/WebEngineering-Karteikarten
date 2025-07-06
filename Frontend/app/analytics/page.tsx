
'use client';
import React, { useEffect, useState } from 'react';
import { getAnalytics, updateAnalytics } from '../../src/services/analyticsService';
import type { Analytics } from '../../src/database/analyticsTypes';
import Headline from '../../src/components/atoms/Headline';
import Button from '../../src/components/atoms/Button';
import Text from '../../src/components/atoms/Text';
import Input from '../../src/components/atoms/Input';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    totalLearningTime: '',
    totalCardsLearned: '',
    totalCorrect: '',
    totalWrong: '',
    resets: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAnalytics()
      .then((data) => {
        setAnalytics(data);
        if (data) setForm({
          totalLearningTime: String(data.totalLearningTime),
          totalCardsLearned: String(data.totalCardsLearned),
          totalCorrect: String(data.totalCorrect),
          totalWrong: String(data.totalWrong),
          resets: String(data.resets),
        });
      })
      .catch(() => setError('Fehler beim Laden der Analytics'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSave = async () => {
    if (!analytics) return;
    setLoading(true);
    setError(null);
    const payload = {
      totalLearningTime: Number(form.totalLearningTime),
      totalCardsLearned: Number(form.totalCardsLearned),
      totalCorrect: Number(form.totalCorrect),
      totalWrong: Number(form.totalWrong),
      resets: Number(form.resets),
    };
    const updated = await updateAnalytics(analytics.id, payload);
    if (updated) {
      setAnalytics(updated);
      setEdit(false);
    } else {
      setError('Fehler beim Speichern');
    }
    setLoading(false);
  };

  if (loading) return <Text>Lade Analytics...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!analytics) return <Text>Keine Analytics-Daten gefunden.</Text>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <Headline>Learning Analytics</Headline>
      <div
        style={{
          margin: '32px 0',
          background: 'var(--card-bg, #18191c)',
          borderRadius: 12,
          boxShadow: '0 2px 16px #0003',
          padding: 32,
          color: 'var(--text-color, #f5f5f5)',
          minWidth: 320,
          maxWidth: 500,
          width: '100%',
        }}
      >
        {edit ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <label>
              <Text>Learning time (seconds)</Text>
              <Input type="number" value={form.totalLearningTime} onChange={handleChange('totalLearningTime')} placeholder="Learning time (seconds)" />
            </label>
            <label>
              <Text>Cards learned</Text>
              <Input type="number" value={form.totalCardsLearned} onChange={handleChange('totalCardsLearned')} placeholder="Cards learned" />
            </label>
            <label>
              <Text>Correct answers</Text>
              <Input type="number" value={form.totalCorrect} onChange={handleChange('totalCorrect')} placeholder="Correct answers" />
            </label>
            <label>
              <Text>Wrong answers</Text>
              <Input type="number" value={form.totalWrong} onChange={handleChange('totalWrong')} placeholder="Wrong answers" />
            </label>
            <label>
              <Text>Resets</Text>
              <Input type="number" value={form.resets} onChange={handleChange('resets')} placeholder="Resets" />
            </label>
            <div style={{ marginTop: 8, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={() => setEdit(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8, color: 'var(--text-color, #f5f5f5)' }}>
            <Text>{`Learning time: ${analytics.totalLearningTime} seconds`}</Text>
            <Text>{`Cards learned: ${analytics.totalCardsLearned}`}</Text>
            <Text>{`Correct answers: ${analytics.totalCorrect}`}</Text>
            <Text>{`Wrong answers: ${analytics.totalWrong}`}</Text>
            <Text>{`Resets: ${analytics.resets}`}</Text>
            <Text>{`Last update: ${new Date(analytics.updatedAt).toLocaleString()}`}</Text>
            <div style={{ marginTop: 12 }}>
              <Button onClick={() => setEdit(true)}>Edit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
