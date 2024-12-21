import type { IndexableType } from 'dexie';

import type { User } from '../../../../../types/user';
import type { ILocalMessage } from '../../../../../types/message';
import type { Conversation } from '../../../../../types/conversation';

import type { DexieDatabase } from '../../../../../services/database/db';
import type { IConversationAPI } from '../../../../../services/api/get-user-conversations';

import { EMessageStatuses } from '../../../../../enums/EMessageStatuses';
import type { IChangeMessageStatusParams, IReadContactMessagesParams } from './method-types';

import { logError, logSuccess } from '../../../../../utils/logging';

interface IDbOperations {
	addMessage(payload: { message: ILocalMessage }): Promise<IndexableType>;
	getCurrentUser(): Promise<User | null>;
	getMessageById(payload: { messageId: ILocalMessage['id'] }): Promise<ILocalMessage | null>;
	readConversationMessages(payload: IReadContactMessagesParams): Promise<void>;
	saveConversations(payload: IConversationAPI[]): Promise<void>;
	saveUser(payload: User): Promise<IndexableType>;
	changeMessageStatus(payload: IChangeMessageStatusParams): Promise<void>;
}

export class DbOperations implements IDbOperations {
	constructor(private readonly database: DexieDatabase) {}

	async addMessage(payload: { message: ILocalMessage }): Promise<IndexableType> {
		return await this.database.messages.add(payload.message);
	}

	async getCurrentUser(): Promise<User | null> {
		const user = await this.database.user.toArray();
		return user[0];
	}

	async getMessageById(payload: { messageId: string }): Promise<ILocalMessage | null> {
		return (await this.database.messages.get({ id: payload.messageId })) || null;
	}

	async readConversationMessages({
		conversationId,
		whoRead
	}: IReadContactMessagesParams): Promise<void> {
		await this.database.messages
			.where({ conversationId: conversationId })
			.and((item) => item.author.id !== whoRead)
			.and((item) => item.read.byAllAt === null)
			.modify({ 'read.byAllAt': new Date() });
	}

	async saveConversations(payload: IConversationAPI[]): Promise<void> {
		const indexedConversation: Conversation[] = payload.map((item) => ({
			id: item.conversation.id,
			groupName: item.conversation.groupName,
			groupDescription: item.conversation.groupDescription,
			isGroup: !!item.conversation.groupId,
			createdAt: item.conversation.createdAt,
			participants: item.participants,
			conversationPinnedAt: item.conversation.conversationPinnedAt
		}));

		this.database.conversations
			.bulkPut(indexedConversation)
			.then(() => logSuccess('Local database was successfully synchronized with API data.'))
			.catch((error) =>
				logError('Error on trying to synchronize API data with local database', error.message)
			);
	}

	async saveUser(payload: User): Promise<IndexableType> {
		return await this.database.user.add(payload);
	}

	async changeMessageStatus({ messageId, status }: IChangeMessageStatusParams): Promise<void> {
		if (status === EMessageStatuses.RECEIVED) {
			await this.database.messages
				.where({ id: messageId })
				.modify({ 'received.byAllAt': new Date() })
				.then(() => logSuccess(`The message status was updated on local database: ${messageId}`))
				.catch((error) => {
					logError(
						`Error on trying to update the "${messageId}" message status at Indexed DB`,
						error
					);
				});
		}

		if (status === EMessageStatuses.SENT) {
			await this.database.messages.where({ id: messageId }).modify({ sentAt: new Date() });
		}
	}
}
