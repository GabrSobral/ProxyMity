export interface Conversation {
   dbId?: number;
   order?: number;
   id: string;
   isGroup: boolean;
   createdAt: Date;
   groupName: string | null;
   groupDescription: string | null;
   conversationPinnedAt: Date | null;
   participants: {
      id: string;
      firstName: string;
      lastName: string | null;
      email: string;
      photoUrl: string | null;
      lastOnline: Date | null;
      createdAt: Date;
      removedAt: Date | null;
      // status: 'online' | 'busy' | 'offline' | 'invisible';
   }[];
}
