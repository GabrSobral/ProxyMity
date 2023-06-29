import { User } from '@application/entities/user';
import { Group } from '@application/entities/group';
import { Conversation } from '@application/entities/conversation';

import { GroupRepository } from '@application/repositories/group-repository';
import { ParticipantRepository } from '@application/repositories/participant-repository';
import { ConversationRepository } from '@application/repositories/conversation-repository';

import { Either, left, right } from '@helpers/Either';
import { Participant } from '@application/entities/participant';

interface Request {
  name: string;
  description: string | null;
  participants: User['_id'][];
}

interface Response {
  conversation: Conversation;
  group: Group;
}

export class CreateGroupUseCase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {}

  async execute({ name, description, participants }: Request): Promise<Either<Error, Response>> {
    if (!name) return left(new Error('No name provided.'));

    if (participants.length < 1) return left(new Error('The group must have more than 1 participant'));

    const group = Group.create({
      name,
      description,
      conversation: null,
    });

    const conversation = Conversation.create({
      isGroup: true,
      groupId: group.id,
      createdAt: group.createdAt,
    });

    await this.conversationRepository.create(conversation);

    await Promise.all(
      participants.map(async participantId => {
        const participant = Participant.create({ conversationId: conversation.id, userId: participantId });

        await this.participantRepository.add(participant);
      }),
    );

    await this.groupRepository.create(group);

    return right({
      conversation,
      group,
    });
  }
}
