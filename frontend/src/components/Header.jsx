export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="text-lg font-semibold text-gray-800">Text To Speech</span>
      </div>
      <nav className="flex items-center gap-4 text-sm text-gray-600">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
          Text to Speech
        </span>
      </nav>
    </header>
  );
}
