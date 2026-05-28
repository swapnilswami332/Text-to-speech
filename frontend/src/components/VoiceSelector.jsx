const VOICES = [
  { id: 'adam', name: 'Adam', lang: 'US', style: 'Deep, Engaging', hot: true },
  { id: 'evelyn', name: 'Evelyn', lang: 'US', style: 'Soft, Emotional', hot: true },
  { id: 'derek', name: 'Derek', lang: 'US', style: 'Formal, Confident', hot: true },
  { id: 'lola', name: 'Lola', lang: 'US', style: 'Calm, Warm', hot: true },
  { id: 'lewis', name: 'Lewis', lang: 'US', style: 'Confident, Authoritative', hot: true },
  { id: 'ava', name: 'Ava', lang: 'US', style: 'Friendly, Clear', hot: true },
];

export default function VoiceSelector({ selectedVoice, onSelect, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-400 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {selectedVoice.name[0]}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">{selectedVoice.name}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Voices</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">English (US)</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => { onSelect(voice); onToggle(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                  selectedVoice.id === voice.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-gray-600 text-sm font-bold">{voice.name[0]}</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {voice.name}
                    </span>
                    <span className="text-xs text-gray-500">({voice.lang})</span>
                    {voice.hot && (
                      <span className="text-xs text-red-500 font-medium">Hot</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">90+ Languages, {voice.style}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
