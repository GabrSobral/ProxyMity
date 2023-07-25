import { randomUUID } from 'node:crypto';

import { Replace } from '@helpers/Replace';

import { Conversation } from './conversation';

interface GroupProps {
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;

  conversation: Conversation | null;
}

export class Group {
  private _id: string;
  private props: GroupProps;

  private constructor(props: GroupProps, id?: string) {
    this._id = id ?? randomUUID();

    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this.props.name;
  }

  public get description() {
    return this.props.description;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get conversation(): Conversation | null {
    return this.props.conversation;
  }

  public set conversation(conversation: Conversation) {
    this.props.conversation = conversation;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Replace<GroupProps, { createdAt?: Date; updatedAt?: Date }>, id?: string) {
    return new Group(
      {
        ...props,
        createdAt: props?.createdAt ?? new Date(),
        updatedAt: props?.updatedAt ?? null,
      },
      id ?? randomUUID(),
    );
  }
}
