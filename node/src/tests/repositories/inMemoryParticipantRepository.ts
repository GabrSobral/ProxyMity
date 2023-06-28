import { Participant } from '@application/entities/participant';
import { ParticipantRepository } from '@application/repositories/participant-repository';
import { Either, right } from '@helpers/Either';

export class InMemoryParticipantRepository implements ParticipantRepository {
  public items: Participant[];

  constructor() {
    this.items = [];
  }

  async add(participant: Participant): Promise<Either<Error, void>> {
    this.items.push(participant);

    return right(void 0);
  }

  async getByConversationId(conversationId: string): Promise<Either<Error, Participant[]>> {
    const participants = this.items.filter(item => item.conversationId === conversationId);

    return right(participants);
  }

  async remove(participant: Participant): Promise<Either<Error, void>> {
    this.items = this.items.filter(
      item => item.userId === participant.userId && item.conversationId === participant.conversationId,
    );

    return right(void 0);
  }
}
