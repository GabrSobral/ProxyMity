export function ContactItem() {
  return (
    <li className="w-full p-3 rounded-xl flex gap-4 cursor-pointer hover:bg-[#766AC8] transition-colors group">
      <div className="min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] rounded-full bg-gray-900 brightness-75 group-hover:bg-[#766AC8] transition-colors">
      </div>

      <div className="flex flex-col gap-2 overflow-hidden">
        <span className="text-gray-200 truncate font-medium flex items-center justify-between gap-3">
          Contact Name

          <span className="text-[12px] text-gray-400">
            16:32
          </span>
        </span>
        
        <span className="text-gray-400 truncate group-hover:text-gray-200">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit debitis tempore, possimus magnam minima sint nisi doloremque ratione
        </span>
      </div>
    </li>
  )
}