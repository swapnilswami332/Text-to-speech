export default function Sidebar({ onUploadPdf, isExtractingPdf }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPdf(file);
      e.target.value = '';
    }
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col p-4 gap-2">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Input</h2>

      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => document.getElementById('pdf-upload').click()}
        disabled={isExtractingPdf}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {isExtractingPdf ? 'Extracting...' : 'Upload PDF'}
      </button>

      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-auto pt-4 border-t border-gray-100">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Features</h2>
        <ul className="space-y-1 text-xs text-gray-500">
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            Text to Speech
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            PDF Reading
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
            MP3 Download
          </li>
        </ul>
      </div>
    </aside>
  );
}
