import { Participant } from '@application/entities/participant';

import {
  IGetConversationsByUserIdResponse,
  IGetParticipantsByConversationIdResponse,
  ParticipantRepository,
} from '@application/repositories/participant-repository';
import { UserRepository } from '@application/repositories/user-repository';
import { GroupRepository } from '@application/repositories/group-repository';
import { ConversationRepository } from '@application/repositories/conversation-repository';

import { Either, left, right } from '@helpers/Either';

export class InMemoryParticipantRepository implements ParticipantRepository {
  public items: Participant[];

  public userRepository: UserRepository | null = null;
  public groupRepository: GroupRepository | null = null;
  public conversationRepository: ConversationRepository | null = null;

  constructor() {
    this.items = [];
  }

  setConversationRepository(conversationRepository: ConversationRepository) {
    this.conversationRepository = conversationRepository;
  }
  setUserRepository(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  setGroupRepository(groupRepository: GroupRepository) {
    this.groupRepository = groupRepository;
  }

  async add(participant: Participant): Promise<Either<Error, void>> {
    this.items.push(participant);

    return right(void 0);
  }

  async remove(participant: Participant): Promise<Either<Error, void>> {
    this.items = this.items.filter(
      item => item.userId === participant.userId && item.conversationId === participant.conversationId,
    );

    return right(void 0);
  }

  async getByConversationId(conversationId: string): Promise<Either<Error, Participant[]>> {
    const participants = this.items.filter(item => item.conversationId === conversationId);

    return right(participants);
  }

  async getByUserId(userId: string): Promise<Either<Error, Participant[]>> {
    const userConversations = this.items.filter(item => item.userId === userId);

    return right(userConversations);
  }

  async getConversationsByUserId(userId: string): Promise<Either<Error, IGetConversationsByUserIdResponse[]>> {
    if (!this.conversationRepository) {
      return left(new Error('Conversation Repository must be passed to this test'));
    }
    if (!this.groupRepository) {
      return left(new Error('Group Repository must be passed to this test'));
    }

    const participationInConversations = this.items.filter(item => item.userId === userId);

    const conversationsWithParticipants = await Promise.all(
      participationInConversations.map(async participant => {
        const conversation = await this.conversationRepository!.getById(participant.conversationId);

        if (conversation.isLeft() || !conversation.value) {
          throw new Error('Invalid conversation query');
        }

        const group = await this.groupRepository!.findById(conversation.value.groupId || '');

        if (group.isLeft()) {
          throw new Error('Invalid group query');
        }

        return {
          id: conversation.value.id,
          createdAt: conversation.value.createdAt,
          disabledAt: conversation.value.disabledAt,
          isGroup: conversation.value.isGroup,
          groupDescription: group.value?.description || null,
          groupName: group.value?.name || null,
        };
      }),
    );

    return right(conversationsWithParticipants);
  }

  async getParticipantsByConversationId(
    conversationId: string,
  ): Promise<Either<Error, IGetParticipantsByConversationIdResponse[]>> {
    if (!this.userRepository) {
      return left(new Error('User Repository must be passed to this test'));
    }

    const participantsOfConversation = this.items.filter(item => item.conversationId === conversationId);

    const participants = await Promise.all(
      participantsOfConversation.map(async participant => {
        const user = await this.userRepository!.findById(participant.userId);

        if (user.isLeft() || !user.value) {
          throw new Error('Invalid user query');
        }

        const result: IGetParticipantsByConversationIdResponse = {
          id: user.value.id,
          name: user.value.name,
          email: user.value.email,
          lastOnline: user.value.lastOnline,
          enteredAt: participant.createdAt,
          removedAt: participant.removedAt,
        };

        return result;
      }),
    );

    return right(participants);
  }
}
