import { Modal } from '@/@design-system/Modal';
import { Status } from './Profile';

interface Props {
	closeModal: () => void;
	show: boolean;
	selectStatus: (status: Status) => void;
}

export function ChangeStatusModal({ show, closeModal, selectStatus }: Props) {
	return (
		<Modal show={show} closeModal={closeModal}>
			<Modal.Title>Change Status</Modal.Title>
			<Modal.Description>
				Select a status to demonstrate your current situation.
				<br />
				This status will be shown to all your contacts
			</Modal.Description>

			<div className="flex gap-1 flex-wrap mt-2">
				<button
					type="button"
					onClick={() => selectStatus('online')}
					className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-700 group relative overflow-hidden flex-1"
				>
					<div className="bg-green-500 w-[14px] h-[14px] rounded-full group-hover:w-full group-hover:h-[100%] group-hover:left-0 group-hover:right-0 group-hover:top-0 group-hover:bottom-0 top-2/4 left-4 right-auto bottom-auto -translate-y-2/4 group-hover:translate-y-0  group-hover:rounded-md transition-all duration-300 absolute z-10" />
					<span className="z-20 text-white pl-6 tracking-wider">Online</span>
				</button>

				<button
					type="button"
					onClick={() => selectStatus('busy')}
					className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-700 group relative overflow-hidden flex-1"
				>
					<div className="bg-red-400 w-[14px] h-[14px] rounded-full group-hover:w-full group-hover:h-[100%] group-hover:left-0 group-hover:right-0 group-hover:top-0 group-hover:bottom-0 top-2/4 left-4 right-auto bottom-auto -translate-y-2/4 group-hover:translate-y-0 group-hover:rounded-md transition-all duration-300 absolute z-10" />
					<span className="z-20 text-white pl-6 tracking-wider">Busy</span>
				</button>

				<button
					type="button"
					onClick={() => selectStatus('invisible')}
					className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-700 group relative overflow-hidden flex-1"
				>
					<div className="bg-gray-900 group-hover:border group-hover:border-solid group-hover:border-gray-700 w-[14px] h-[14px] rounded-full group-hover:w-full group-hover:h-[100%] group-hover:left-0 group-hover:right-0 group-hover:top-0 group-hover:bottom-0 top-2/4 left-4 right-auto bottom-auto -translate-y-2/4 group-hover:translate-y-0 group-hover:rounded-md transition-all duration-300 absolute z-10" />
					<span className="z-20 text-white pl-6 tracking-wider">Invisible</span>
				</button>
			</div>
		</Modal>
	);
}
