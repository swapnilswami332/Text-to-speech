import { useState, useRef, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TextEditor from './components/TextEditor';
import VoiceSelector from './components/VoiceSelector';
import PlaybackControls from './components/PlaybackControls';
import { generateSpeech, extractPdf } from './api';

const DEFAULT_VOICE = { id: 'adam', name: 'Adam', lang: 'US', style: 'Deep, Engaging', hot: true };

export default function App() {
  const [text, setText] = useState(
    'Welcome to Text To Speech. Paste or type your text here, then press play to hear it spoken aloud with AI-powered text to speech.'
  );
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE);
  const [voiceSelectorOpen, setVoiceSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const progressInterval = useRef(null);
  const lastGeneratedRef = useRef({ text: '', voiceId: '' });

  const stopProgressTimer = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const startProgressTimer = useCallback(() => {
    stopProgressTimer();
    progressInterval.current = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 200);
  }, [stopProgressTimer]);

  const cleanupAudio = useCallback(() => {
    stopProgressTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    lastGeneratedRef.current = { text: '', voiceId: '' };
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setHighlightedText('');
  }, [stopProgressTimer]);

  const generateAndPlay = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text first.');
      return;
    }

    setError('');
    setIsLoading(true);
    cleanupAudio();

    try {
      const blob = await generateSpeech(text, selectedVoice.id);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      lastGeneratedRef.current = { text, voiceId: selectedVoice.id };

      const audio = new Audio(url);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setHighlightedText('');
        stopProgressTimer();
      });

      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
      startProgressTimer();
      setHighlightedText(text.slice(0, 80) + (text.length > 80 ? '...' : ''));
    } catch (err) {
      setIsLoading(false);
      let detail = err.response?.data?.detail;
      if (!detail && err.response?.data instanceof Blob) {
        try {
          const errText = await err.response.data.text();
          const parsed = JSON.parse(errText);
          detail = parsed.detail;
        } catch {
          // ignore parse errors
        }
      }
      const status = err.response?.status;
      if (status === 405) {
        detail = 'Speech API not found on port 8000. Start the TTS backend (uvicorn on port 800).';
      }
      setError(detail || err.message || 'Failed to generate speech. Is the backend running?');
    }
  }, [text, selectedVoice.id, playbackRate, cleanupAudio, startProgressTimer, stopProgressTimer]);

  const handlePlay = useCallback(async () => {
    const needsNewAudio =
      !audioRef.current ||
      lastGeneratedRef.current.text !== text ||
      lastGeneratedRef.current.voiceId !== selectedVoice.id;

    if (needsNewAudio) {
      await generateAndPlay();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopProgressTimer();
      return;
    }

    try {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
        setProgress(0);
      }
      await audioRef.current.play();
      setIsPlaying(true);
      startProgressTimer();
      setHighlightedText(text.slice(0, 80) + (text.length > 80 ? '...' : ''));
    } catch {
      setError('Could not resume playback.');
    }
  }, [text, selectedVoice.id, isPlaying, generateAndPlay, startProgressTimer, stopProgressTimer]);

  const seekAudio = useCallback((deltaSeconds) => {
    if (!audioRef.current || !duration) return;

    const nextTime = Math.min(duration, Math.max(0, audioRef.current.currentTime + deltaSeconds));
    audioRef.current.currentTime = nextTime;
    setProgress(nextTime);
  }, [duration]);

  const handleRewind = useCallback(() => {
    seekAudio(-5);
  }, [seekAudio]);

  const handleForward = useCallback(() => {
    seekAudio(5);
  }, [seekAudio]);

  const handleToggleSpeed = useCallback(() => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  }, [playbackRate]);

  const handleUploadPdf = useCallback(async (file) => {
    setIsExtractingPdf(true);
    setError('');
    try {
      const result = await extractPdf(file);
      setText(result.text);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract PDF text.');
    } finally {
      setIsExtractingPdf(false);
    }
  }, []);

  useEffect(() => {
    return cleanupAudio;
  }, [cleanupAudio]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar onUploadPdf={handleUploadPdf} isExtractingPdf={isExtractingPdf} />

        <main className="flex-1 flex flex-col p-6 gap-4 overflow-auto">
          {/* Top toolbar */}
          <div className="flex items-center justify-between">
            <VoiceSelector
              selectedVoice={selectedVoice}
              onSelect={setSelectedVoice}
              isOpen={voiceSelectorOpen}
              onToggle={() => setVoiceSelectorOpen(!voiceSelectorOpen)}
            />
            <PlaybackControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              onPlay={handlePlay}
              onRewind={handleRewind}
              onForward={handleForward}
              onToggleSpeed={handleToggleSpeed}
              playbackRate={playbackRate}
              progress={progress}
              duration={duration}
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Text editor */}
          <TextEditor
            text={text}
            onChange={setText}
            highlightedText={isPlaying ? highlightedText : ''}
          />
        </main>
      </div>
    </div>
  );
}
