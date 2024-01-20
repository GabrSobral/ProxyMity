import type { HubConnection } from "@microsoft/signalr";
import type { ILocalMessage, IServerMessage } from "../../../../../../types/message";

import { chatDispatch } from '../stores/chat';
import type { ChatState } from "../stores/chat-store-types";
import { sendReceiveMessageWebSocketEvent } from "../../websocket-context/Emitters/sendReceiveMessage";
import { sendReadMessageWebSocketEvent } from "../../websocket-context/Emitters/sendReadMessage";
import { toast } from "svelte-sonner";
import { getChatContext } from "../ChatContext.svelte";

export async function receiveMessageHandlerUncoupled(
    message: IServerMessage, 
    externals: { 
        chatState: ChatState, 
        user: { id: string },
        connection: HubConnection | null,
        dbWorker?: Worker;
    }
) {
    console.log("1", externals, message)
    const { chatState, user, connection, dbWorker } = externals;
    const { selectedConversationAsync } = getChatContext();

    if (!message || !user || !connection) {
       return;
    }

    console.log("2")

    const webSocketsPayload = {
       userId: user.id,
       conversationId: message.conversationId,
       messageId: message.id,
       isConversationGroup: chatState.selectedConversation?.isGroup || false,
    };

    if (chatState.selectedConversation && chatState.selectedConversation?.id === message.conversationId) {
       sendReceiveMessageWebSocketEvent(connection, webSocketsPayload);
       sendReadMessageWebSocketEvent(connection, webSocketsPayload);
       console.log("3")
    } else {
       const messageConversation = chatState.conversations.find(item => item.id === message.conversationId);

       toast.message("New message", {
          description: message.content,
          action: {
             label: "Open",
             onClick: () => {
                const conversation = chatState.conversations.find(item => item.id === message.conversationId);

                if(conversation){
                   selectedConversationAsync(conversation);
                }
             }
          }
       })

       if (messageConversation && connection)
          sendReceiveMessageWebSocketEvent(connection, {
             ...webSocketsPayload,
             isConversationGroup: messageConversation?.isGroup,
          });

          console.log("4")
    }

    const payload: ILocalMessage = await (async () => ({
       id: message.id,
       content: message.content,
       conversationId: message.conversationId,
       writtenAt: message.writtenAt,
       author: {
          id: message.authorId,
          name: 'name',
       },
       repliedMessage: message.repliedMessageId
          ? {
               id: message.repliedMessageId,
               content: await (async () => {
                   const repliedMessage = await dbWorker?.postMessage({ type: "getMessageById", payload: { messageID: message.repliedMessageId } });
                   return repliedMessage?.content || "";
               })(),
            }
          : null,
       received: { byAllAt: message.receivedByAllAt, users: [] },
       sentAt: message.sentAt,
       read: { byAllAt: message.readByAllAt, users: [] },
       // readByAllAt: chatState.selectedConversation?.id === message.conversationId ? new Date() : null,
    }))();

    console.log("5")

    chatDispatch.addMessage({ message: payload });
    chatDispatch.bringToTop(message.conversationId);

    // addMessageAsyncDB(payload);

    dbWorker?.postMessage({ type: "addMessage", payload: { message: payload } })

    console.log("6")
 }