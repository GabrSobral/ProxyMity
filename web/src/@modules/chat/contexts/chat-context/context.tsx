'use client';

import { createContext, ReactNode, RefObject, useCallback, useEffect, useRef } from 'react';

import { APIGetUserConversations } from '@/services/api/get-user-conversations';
import { APIGetConversationMessages } from '@/services/api/get-conversation-messages';

import { addMessageAsyncDB } from '@/services/database/use-cases/add-message';
import { saveConversationsAsyncDB } from '@/services/database/use-cases/save-conversations';
import { getConversationCacheAsyncDB } from '@/services/database/use-cases/get-conversations-state';
import { readConversationMessagesAsyncDB } from '@/services/database/use-cases/read-conversation-messages';
import { getConversationsMessagesAsyncDB } from '@/services/database/use-cases/get-conversations-messages';

import { useAuth } from '@/contexts/auth-context/hook';

import { useWebSocket } from '../websocket-context/hook';
import { Events, ExtractPayloadType } from '../websocket-context/handler';
import { sendReadMessageWebSocketEvent } from '../websocket-context/emmiters/sendReadMessage';
import { sendReceiveMessageWebSocketEvent } from '../websocket-context/emmiters/sendReceiveMessage';

import { Message } from '@/types/message';

import { ConversationState, useChatsStore } from './stores/chat';

interface ChatContextProps {
	selectConversationAsync: (params: { conversation: ConversationState }) => Promise<void>;
	typebarRef: RefObject<HTMLInputElement>;
}

export const ChatContext = createContext({} as ChatContextProps);

export function ChatProvider({ children }: { children: ReactNode }) {
	const typebarRef = useRef<HTMLInputElement>(null);
	const { user, accessToken } = useAuth();
	const { connection } = useWebSocket();

	const {
		selectedConversation,
		conversations,
		setConversationMessages,
		addMessage,
		setConversationInitialState,
		updateConversationMessageStatus,
		saveTypeMessageFromConversation,
		bringToTop,
		selectConversation,
	} = useChatsStore();

	console.log({ userId: user?.id, accessToken });
	useEffect(() => {
		if (!user?.id || !accessToken) return;

		APIGetUserConversations({ id: user.id }, { accessToken })
			.then(conversationsData => {
				console.log('Fetching conversations data was successfully.');

				setConversationInitialState({ conversationsData, userId: user.id });

				const filteredData = conversationsData.map(data => ({
					...data,
					participants: data.participants.filter(item => item.id !== user.id),
				}));

				saveConversationsAsyncDB(filteredData);
			})
			.catch(error => {
				console.error('Error on trying to fetch conversations, data will be taken from the cache', error);

				getConversationCacheAsyncDB({ userId: user.id }).then(conversationsData =>
					setConversationInitialState({ conversationsData, userId: user.id })
				);
			});
	}, [user?.id, setConversationInitialState, accessToken]);

	// //🟡 Receive a message from another user, and store it at state and IndexedDB
	// useEffect(() => {
	// 	function handler(e: CustomEventInit<ExtractPayloadType<'receive_message', Events>>) {
	// 		const message = e.detail?.message;

	// 		if (!message || !user) {
	// 			return;
	// 		}

	// 		if (selectedConversation?.id === message.conversationId) {
	// 			sendReceiveMessageWebSocketEvent(connection, {
	// 				userId: user.id,
	// 				conversationId: message.conversationId,
	// 				messageId: message.id,
	// 				isConversationGroup: selectedConversation.isGroup,
	// 			});

	// 			sendReadMessageWebSocketEvent(connection, {
	// 				userId: user.id,
	// 				conversationId: selectedConversation.id,
	// 				isConversationGroup: selectedConversation.isGroup,
	// 			});
	// 		} else {
	// 			const messageConversation = conversations.find(item => item.id === message.conversationId);

	// 			if (messageConversation)
	// 				sendReceiveMessageWebSocketEvent(connection, {
	// 					userId: user.id,
	// 					conversationId: message.conversationId,
	// 					messageId: message.id,
	// 					isConversationGroup: messageConversation?.isGroup,
	// 				});
	// 		}

	// 		const payload: Message = {
	// 			...message,
	// 			receivedByAllAt: new Date(),
	// 			readByAllAt: selectedConversation?.id === message.authorId ? new Date() : null,
	// 		};

	// 		const shouldNotification = selectedConversation?.id !== message.authorId;

	// 		addMessageAsyncDB(payload);
	// 		addMessage({ conversationId: message.conversationId, message: payload, shouldNotification });
	// 		bringToTop(message.authorId);
	// 	}

	// 	addEventListener('@ws.receive_message', handler);
	// 	return () => removeEventListener('@ws.receive_message', handler);
	// }, [
	// 	selectedConversation?.id,
	// 	selectedConversation?.isGroup,
	// 	connection,
	// 	user,
	// 	addMessage,
	// 	bringToTop,
	// 	conversations,
	// ]);

	// //🟡 Receive the "read" message status from another user, and update it at state and IndexedDB
	// useEffect(() => {
	// 	function handler(event: CustomEventInit<ExtractPayloadType<'receive_read_message', Events>>) {
	// 		if (!user?.id) return;

	// 		const conversationId = event.detail?.conversationId || '';

	// 		updateConversationMessageStatus({ conversationId, status: 'read' });
	// 		// readConversationMessagesAsyncDB({ contactId: conversationId, userId: user.id, itsMe: false });
	// 	}

	// 	addEventListener('@ws.receive_read_message', handler);
	// 	return () => removeEventListener('@ws.receive_read_message', handler);
	// }, [user?.id, updateConversationMessageStatus]);

	// //🟡 Receive a message that has the status changed, and update it on react state and IndexedDB
	// useEffect(() => {
	// 	function handler(event: CustomEventInit<ExtractPayloadType<'receive_message_status', Events>>) {
	// 		if (event.detail) {
	// 			const { messageId } = event.detail;
	// 			const messageStatusEvent = new CustomEvent(messageId, { detail: event.detail });

	// 			dispatchEvent(messageStatusEvent);
	// 		}
	// 	}

	// 	addEventListener('@ws.receive_message_status', handler);
	// 	return () => removeEventListener('@ws.receive_message_status', handler);
	// }, [updateConversationMessageStatus]);

	const selectConversationAsync = useCallback(
		async ({ conversation }: { conversation: ConversationState }) => {
			if (conversation === selectedConversation || !user) return;

			saveTypeMessageFromConversation({
				conversationId: selectedConversation?.id || '',
				typeMessage: typebarRef.current?.value || '',
			});

			selectConversation(conversation);

			if (!conversation.hasMessagesFetched) {
				try {
					const { messages } = await APIGetConversationMessages({ conversationId: conversation.id });
					setConversationMessages({ conversationId: conversation.id, messages });
				} catch (error) {
					console.error('Error fetching conversations, data will be taken from the cache', error);

					const messages = await getConversationsMessagesAsyncDB(conversation.id);
					setConversationMessages({ conversationId: conversation.id, messages });
				}
			}

			updateConversationMessageStatus({ conversationId: conversation.id, status: 'read' });
			readConversationMessagesAsyncDB({ conversationId: conversation.id, userId: user.id });

			if (conversation.notifications > 0)
				sendReadMessageWebSocketEvent(connection, {
					userId: user.id,
					conversationId: conversation.id,
					isConversationGroup: conversation.isGroup,
				});
		},
		[
			selectedConversation,
			user,
			saveTypeMessageFromConversation,
			selectConversation,
			updateConversationMessageStatus,
			connection,
			setConversationMessages,
		]
	);

	return (
		<ChatContext.Provider
			value={
				{
					// selectConversationAsync,
					// typebarRef,
				}
			}
		>
			{children}
		</ChatContext.Provider>
	);
}
