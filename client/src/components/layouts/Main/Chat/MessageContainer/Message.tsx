import clsx from 'clsx';
import { Check } from 'react-feather';

interface MessageProps {
  content: string;
  receivedAt: Date;
  writtenAt: Date;
  isMine: boolean;
}

export function Message({ content, isMine, receivedAt, writtenAt, }: MessageProps) {
  const formatter = Intl.DateTimeFormat("pt-br", { hour: "numeric", minute: "numeric" });

  return (
    <div className={clsx("w-fit h-fit p-2 px-4 rounded  flex gap-1", {
      "ml-auto": isMine,
      "bg-blue-500": isMine,
      "bg-gray-600": !isMine
    })}>
      <span className='text-white'>
        {content}
      </span>

      <span className='text-[12px] flex items-center gap-1 text-white ml-auto bottom-[-9px] right-[-10px] relative'>
        { isMine ? formatter.format(writtenAt) : formatter.format(receivedAt) }
        <Check size={13} className='text-white'/>
      </span>
    </div>
  ) 
}