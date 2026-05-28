export default function TextEditor({ text, onChange, highlightedText }) {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full h-full min-h-[300px] p-6 text-gray-800 text-base leading-relaxed resize-none focus:outline-none placeholder-gray-400"
        />
        {highlightedText && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-50 border-t border-green-200 p-4">
            <p className="text-center text-green-800 text-sm italic">{highlightedText}</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-500">
          {text.length} characters | ~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 150)} min read
        </span>
      </div>
    </div>
  );
}
