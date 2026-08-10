import { useEffect, useState } from 'react';
import { extractPdf, generateSpeech } from './api';

const VOICES = [
  { id: 'adam', name: 'Adam' },
  { id: 'evelyn', name: 'Evelyn' },
  { id: 'derek', name: 'Derek' },
  { id: 'lola', name: 'Lola' },
  { id: 'lewis', name: 'Lewis' },
  { id: 'ava', name: 'Ava' },
];

export default function App() {
  const [text, setText] = useState(
    'Welcome to Text To Speech. Type or paste your text here, then generate your audio.',
  );
  const [voiceId, setVoiceId] = useState('adam');
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Enter some text before generating audio.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const blob = await generateSpeech(text, voiceId);
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      let detail = err.response?.data?.detail;
      if (!detail && err.response?.data instanceof Blob) {
        try {
          const responseText = await err.response.data.text();
          detail = JSON.parse(responseText).detail;
        } catch {
          // Use the fallback message when the API response is not JSON.
        }
      }
      setError(detail || err.message || 'Failed to generate speech.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadPdf = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtractingPdf(true);
    setError('');

    try {
      const result = await extractPdf(file);
      setText(result.text);
      setAudioUrl('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not extract text from this PDF.');
    } finally {
      setIsExtractingPdf(false);
      event.target.value = '';
    }
  };

  const selectedVoice = VOICES.find((voice) => voice.id === voiceId);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <main className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
            T
          </div>
          <h1 className="text-3xl font-bold">Text to Speech</h1>
          <p className="mt-2 text-slate-500">Turn text or a PDF into natural-sounding audio.</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <label htmlFor="text-input" className="mb-2 block text-sm font-medium">
            Your text
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setAudioUrl('');
            }}
            placeholder="Type or paste text here..."
            className="min-h-64 w-full resize-y rounded-xl border border-slate-300 p-4 leading-relaxed outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>{text.length} characters</span>
            <span>{wordCount} words</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="voice" className="mb-2 block text-sm font-medium">
                Voice
              </label>
              <select
                id="voice"
                value={voiceId}
                onChange={(event) => {
                  setVoiceId(event.target.value);
                  setAudioUrl('');
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {VOICES.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} · English (US)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium">Import</span>
              <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-center text-sm text-slate-600 transition hover:border-blue-500 hover:text-blue-600">
                {isExtractingPdf ? 'Extracting text...' : 'Upload a PDF'}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleUploadPdf}
                  disabled={isExtractingPdf}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isGenerating ? 'Generating audio...' : 'Generate speech'}
          </button>

          {audioUrl && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="mb-3 text-sm font-medium">{selectedVoice.name}&apos;s audio is ready</p>
              <audio controls src={audioUrl} className="w-full">
                Your browser does not support audio playback.
              </audio>
              <a
                href={audioUrl}
                download={`text-to-speech-${voiceId}.mp3`}
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Download MP3
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
