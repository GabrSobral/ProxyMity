import { Replace } from '@helpers/Replace';
import { Conversation } from './conversation';
import { User } from './user';

interface ParticipantProps {
  userId: User['_id'];
  conversationId: Conversation['_id'];
  createdAt: Date;
  removedAt: Date | null;
}

export class Participant {
  private props: ParticipantProps;

  private constructor(props: ParticipantProps) {
    this.props = props;
  }

  public get userId() {
    return this.props.userId;
  }

  public get conversationId() {
    return this.props.conversationId;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get removedAt() {
    return this.props.removedAt;
  }

  public remove() {
    this.props.removedAt = new Date();
  }

  static create(props: Replace<ParticipantProps, { createdAt?: Date; removedAt?: Date }>) {
    return new Participant({
      ...props,
      createdAt: props.createdAt || new Date(),
      removedAt: props.removedAt || null,
    });
  }
}
