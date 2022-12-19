import { ChatHeader } from './ChatHeader';
import { MessageContainer } from './MessageContainer';
import { TypeBar } from './TypeBar';

export function Chat() {
	return (
		<main className="flex flex-col flex-1">
			<ChatHeader />
			<section className="flex flex-1 w-full flex-col max-w-[40rem] mx-auto">
				<MessageContainer />
				<TypeBar />
			</section>
		</main>
	);
}
