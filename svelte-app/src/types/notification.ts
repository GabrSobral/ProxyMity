import type { Conversation } from "./conversation";
import type { User } from "./user";

export interface INotification {
    id: string;
    type: ENotificationType;
    conversationId: Conversation["id"];
    userId: User["id"];
    readAt: Date | null;
    createdAt: Date;
}

export enum ENotificationType {
    NEW_MESSAGE,
} 