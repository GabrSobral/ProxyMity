import { randomUUID } from 'node:crypto';

import { Group } from './group';

import { Replace } from '@helpers/Replace';

interface ConversationProps {
  groupId: Group['id'] | null;
  isGroup: boolean;
  createdAt: Date;
  disabledAt: Date | null;
}

type CreateConversation =
  | Replace<ConversationProps, { createdAt?: Date; disabledAt?: Date; groupId?: Group['_id']; isGroup: false }>
  | Replace<ConversationProps, { createdAt?: Date; disabledAt?: Date; groupId: Group['_id']; isGroup: true }>;

export class Conversation {
  private _id: string;
  private props: ConversationProps;

  private constructor(props: ConversationProps, id?: string) {
    this._id = id ?? randomUUID();

    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public get groupId() {
    return this.props.groupId;
  }

  public get disabledAt() {
    return this.props.disabledAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get isGroup() {
    return this.props.isGroup;
  }

  public disable() {
    this.props.disabledAt = new Date();
  }

  static create(props: CreateConversation, id?: string) {
    return new Conversation(
      {
        ...props,
        createdAt: props?.createdAt ?? new Date(),
        disabledAt: props?.disabledAt ?? null,
        groupId: props?.groupId ?? null,
      },
      id ?? randomUUID(),
    );
  }
}
