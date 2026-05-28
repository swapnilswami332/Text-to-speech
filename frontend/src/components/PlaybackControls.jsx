export default function PlaybackControls({
  isPlaying,
  isLoading,
  onPlay,
  onRewind,
  onForward,
  onToggleSpeed,
  playbackRate,
  progress,
  duration,
}) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
      {/* Rewind */}
      <button
        type="button"
        onClick={onRewind}
        disabled={!duration || isLoading}
        aria-label="Rewind 5 seconds"
        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
        </svg>
      </button>

      {/* Play / Pause */}
      <button
        type="button"
        onClick={onPlay}
        disabled={isLoading}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isLoading
            ? 'bg-gray-200 text-gray-400 cursor-wait'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
        }`}
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Forward */}
      <button
        type="button"
        onClick={onForward}
        disabled={!duration || isLoading}
        aria-label="Forward 5 seconds"
        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
        </svg>
      </button>

      {/* Speed */}
      <button
        type="button"
        onClick={onToggleSpeed}
        disabled={isLoading}
        aria-label="Change playback speed"
        className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {playbackRate}x
      </button>

      {/* Progress */}
      {duration > 0 && (
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-gray-500 font-mono">{formatTime(progress)}</span>
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-mono">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}
