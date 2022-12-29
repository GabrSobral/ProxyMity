import { randomUUID } from 'node:crypto';
import { Contact } from './contact';

interface MessageProps {
  content: string;

  sentAt: Date | null;
  receivedAt: Date | null;
  writtenAt: Date;
  readAt: Date | null;

  recipientId: Contact['_id'];
  authorId: Contact['_id'];
}

export class Message {
  private _id: string;
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

  public sent() {
    this.props.sentAt = new Date();
  }

  public get writtenAt() {
    return this.props.writtenAt;
  }

  public get readAt() {
    return this.props.readAt;
  }
  public read() {
    this.props.readAt = new Date();
  }

  public get receivedAt() {
    return this.props.receivedAt;
  }

  public receive() {
    this.props.receivedAt = new Date();
  }

  public set authorId(authorId: string) {
    this.props.authorId = authorId;
  }
  public get authorId() {
    return this.props.authorId;
  }

  public set recipientId(recipientId: string) {
    this.props.recipientId = recipientId;
  }
  public get recipientId() {
    return this.props.recipientId;
  }

  static create(props: MessageProps, id?: string) {
    const instance = new Message(props, id ?? randomUUID());

    return instance;
  }
}
