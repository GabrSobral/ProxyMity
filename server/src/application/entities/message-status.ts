import { User } from './user';
import { Message } from './message';

import { Replace } from '@helpers/Replace';
import { Conversation } from './conversation';

interface MessageStatusProps {
  userId: User['_id'];
  messageId: Message['_id'];
  conversationId: Conversation['_id'];
  readAt: Date | null;
  receivedAt: Date | null;
}

export class MessageStatus {
  private props: MessageStatusProps;

  private constructor(props: MessageStatusProps) {
    this.props = props;
  }

  public get userId() {
    return this.props.userId;
  }

  public get messageId() {
    return this.props.messageId;
  }

  public get conversationId() {
    return this.props.conversationId;
  }

  public get readAt() {
    return this.props.readAt;
  }

  public get receivedAt() {
    return this.props.receivedAt;
  }

  public read() {
    this.props.readAt = new Date();
  }

  public receive() {
    this.props.receivedAt = new Date();
  }

  static create(props: Replace<MessageStatusProps, { readAt?: Date; receivedAt?: Date }>) {
    return new MessageStatus({
      ...props,
      readAt: props.readAt || null,
      receivedAt: props.receivedAt || null,
    });
  }
}
