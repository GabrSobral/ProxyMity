import { Message } from '@application/entities/message';

export interface MessageRepository {
  create(message: Message): Promise<void>;
}
