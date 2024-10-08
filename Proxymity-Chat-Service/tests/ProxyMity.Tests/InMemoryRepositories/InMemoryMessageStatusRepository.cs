﻿using ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryMessageStatusRepository : InMemoryRepository<MessageStatus>, IMessageStatusRepository {
    public Task CreateAsync(MessageStatus messageStatus, CancellationToken cancellationToken) {
        Items.Add(messageStatus);

        return Task.CompletedTask;
    }

    public async Task UpdateStatusAsync(Ulid userId, Ulid messageId, Ulid conversationId, EMessageStatuses status, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);
        
        foreach (var messageStatus in Items) {
            if (messageStatus.MessageId != messageId || messageStatus.ConversationId != conversationId || messageStatus.UserId != userId) 
                continue;
            
            if (status is EMessageStatuses.READ) 
            {
                messageStatus.ReadAt = DateTime.UtcNow;   
            }
                
            if (status is EMessageStatuses.RECEIVED) 
            {
                messageStatus.ReceivedAt = DateTime.UtcNow;   
            }
        }

        
    }

    public async Task<List<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId, CancellationToken cancellationToken) {
        await Task.Run(() => { });

        return Items.Where(x => x.MessageId == messageId && x.ConversationId == conversationId).ToList();
    }

    public async Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken) {
        await Task.Run(() => { });

        return Items.Where(x => x.UserId == userId && x.ConversationId == conversationId && x.ReadAt == null).Count();
    }

    public async Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId, CancellationToken cancellationToken) {
        await Task.Run(() => { });

        return Items.Where(x => x.ConversationId == conversationId);
    }

    public Task ReadAsync(Ulid userId, Ulid messageId, CancellationToken cancellationToken) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.MessageId == messageId) {
                item.Read();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReadAsync(Ulid userId, Ulid messageId, Ulid conversationId, CancellationToken cancellationToken) {
        throw new NotImplementedException();
    }

    public Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.ConversationId == conversationId) {
                item.Read();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReceiveAsync(Ulid userId, Ulid messageId, Ulid conversationId, CancellationToken cancellationToken) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.MessageId == messageId) {
                item.Receive();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReceiveUnreceivedMessagesByUserIdAsync(Ulid userId, CancellationToken cancellationToken) {
        foreach (var item in Items) {
            if (item.UserId == userId) {
                item.Receive();
            }
        }

        return Task.CompletedTask;
    }
}
