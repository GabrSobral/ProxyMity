import { useRef, useState } from 'react';
import { Mic, Send } from 'react-feather';

export function TypeBar() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [type, setType] = useState('');

	function adjustTextAreaHeight(value: string) {
		if (!textAreaRef?.current) return;

		if (value === '') textAreaRef.current.style.height = '3.5rem';
		else textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight / 16}rem`;

		setType(value);
	}

	return (
		<div className="mb-3 flex gap-4 px-4">
			<form
				action=""
				className="w-full flex flex-1 gap-2"
			>
				<textarea
					ref={textAreaRef}
					placeholder="Message"
					className="rounded-lg flex flex-1 p-4 max-h-[20rem] min-h-[2rem] h-14 transition-all resize-none bg-gray-900 text-white focus:ring-2 focus:ring-purple-600 outline-none text-justify"
					value={type}
					onChange={e => adjustTextAreaHeight(e.target.value)}
				/>

				<button
					type="submit"
					title="Send message"
					className="rounded-full flex items-center justify-center bg-blue-500 min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto"
				>
					<Send className="text-lg text-white" />
				</button>
			</form>

			<button
				type="button"
				title="Record an audio"
				className="rounded-full flex items-center justify-center bg-blue-500 min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto"
				onClick={() => {}}
			>
				<Mic className="text-lg text-white" />
			</button>
		</div>
	);
}
