import { randomUUID } from 'node:crypto';

import { User } from './user';
import { Conversation } from './conversation';

import { Replace } from '@helpers/Replace';

interface MessageProps {
  content: string;

  writtenAt: Date;
  sentAt: Date | null;
  receivedByAllAt: Date | null;
  readByAllAt: Date | null;

  conversationId: Conversation['_id'];
  repliedMessageId: Message['_id'] | null;
  authorId: User['_id'];
}

interface CreateMessageProps {
  content: string;

  writtenAt?: Date;
  sentAt?: Date | null;
  receivedByAllAt?: Date | null;
  readByAllAt?: Date | null;

  conversationId: Conversation['_id'];
  repliedMessageId?: Message['_id'] | null;
  authorId: User['_id'];
}

export class Message {
  private readonly _id: string;
  private props: MessageProps;

  private constructor(props: MessageProps, id?: string) {
    this._id = id ?? randomUUID();

    this.props = {
      ...props,
      writtenAt: props.writtenAt || new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public set content(content: string) {
    this.props.content = content;
  }
  public get content() {
    return this.props.content;
  }

  public get sentAt() {
    return this.props.sentAt;
  }
  public send() {
    this.props.sentAt = new Date();
  }

  public get writtenAt() {
    return this.props.writtenAt;
  }

  public get readAt() {
    return this.props.readByAllAt;
  }
  public read() {
    this.props.readByAllAt = new Date();
  }

  public get receivedAt() {
    return this.props.receivedByAllAt;
  }

  public get conversationId() {
    return this.props.conversationId;
  }

  public get repliedMessageId() {
    return this.props.repliedMessageId;
  }

  public receive() {
    this.props.receivedByAllAt = new Date();
  }

  public set authorId(authorId: string) {
    this.props.authorId = authorId;
  }
  public get authorId() {
    return this.props.authorId;
  }

  static create(props: CreateMessageProps, id?: string) {
    return new Message(
      {
        ...props,
        writtenAt: props.writtenAt || new Date(),
        sentAt: props.sentAt || null,
        receivedByAllAt: props.receivedByAllAt || null,
        readByAllAt: props.readByAllAt || null,
        repliedMessageId: props.repliedMessageId || null,
      },
      id ?? randomUUID(),
    );
  }
}
