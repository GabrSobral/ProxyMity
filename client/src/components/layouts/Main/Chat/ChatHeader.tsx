export function ChatHeader() {
  return (
    <header className="w-full px-4 py-2 h-[4rem] bg-gray-900 flex gap-4">
      <div className="min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem] rounded-full bg-gray-900 brightness-75">
      </div>

      <div>
        <span className="text-gray-200 truncate text-md font-medium flex items-center justify-between gap-3">
          Contact Name
        </span>

        <span className="text-gray-400 truncate group-hover:text-gray-200">
          Last seen yesterday at 16h23
        </span>
      </div>
    </header>
  )
}