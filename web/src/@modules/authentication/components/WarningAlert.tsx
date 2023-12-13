import { Warning, X } from '@phosphor-icons/react';

interface Props {
	errorMessage: string;
	closeAlert: () => void;
}

export function WarningAlert({ errorMessage, closeAlert }: Props) {
	return (
		<div className="w-full bg-red-500 p-2 px-3 rounded-[10px] mb-3 flex gap-2 items-center">
			<Warning size={24} className="text-white" />

			<span className="tracking-wide text-white text-sm">{errorMessage}</span>

			<button type="button" onClick={closeAlert} className="ml-auto" title="Close warning">
				<X size={24} className="text-white" />
			</button>
		</div>
	);
}
