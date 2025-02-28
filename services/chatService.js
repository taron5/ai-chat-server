const { Chat, Message } = require('../models');

class ChatService {
    async saveMessage(messageData) {
        try {
            
            if (!messageData.chatId) {
                const newChat = await Chat.create({
                    name: 'New Chat',
                    userId: 1
                })
                messageData.chatId = newChat.id;
            }

            await Message.create({
                chatId: messageData.chatId,
                message: messageData.message,
                sender: 'user',
            });

            const lastAssistantMessage = await Message.findOne({
                where: { 
                    chatId: messageData.chatId,
                    sender: 'ai'
                },
                order: [['createdAt', 'DESC']]
            });

            let responseContent = "Hi, how can I help you further?";
            if (lastAssistantMessage) {
                const previousMessages = await Message.findAll({
                    where: { chatId: messageData.chatId },
                    order: [['createdAt', 'DESC']],
                    limit: 5
                });
                responseContent = this.generateContextualResponse(previousMessages);
            }

            const assistantMessage = await Message.create({
                chatId: messageData.chatId,
                message: responseContent,
                sender: 'ai'
            });

            await new Promise((resolve) => setTimeout(() => resolve(), 1600))

            return {
                success: true,
                message: assistantMessage
            };
        } catch (error) {
            console.error('Error saving messages:', error);
            throw error;
        }
    }

    async getMessagesByChatId(chatId) {
        try {
            const messages = await Message.findAll({
                where: { chatId },
                order: [['createdAt', 'ASC']],
                attributes: ['id', 'message', 'sender', 'createdAt'],
                include: {
                    model: Chat,
                    as: 'chat',
                    attributes: ['name']
                }
            });

            return {
                success: true,
                chatId,
                messages
            };
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    generateContextualResponse(previousMessages) {
        const messagePatterns = previousMessages.map(msg => msg.message.toLowerCase());
        
        if (messagePatterns.some(msg => msg.includes('hello') || msg.includes('hi'))) {
            return "Hello! How can I assist you today?";
        }
        if (messagePatterns.some(msg => msg.includes('thank'))) {
            return "You're welcome! Is there anything else you'd like to know?";
        }
        if (messagePatterns.some(msg => msg.includes('bye'))) {
            return "Goodbye! Have a great day!";
        }
        
        return "I understand. Please tell me more about what you need.";
    }

    async getAllChats(userId = 1) {
        try {
            const chats = await Chat.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'name', 'userId', 'createdAt'],
                include: {
                    model: Message,
                    as: 'messages',
                    order: [['sender', 'ASC']],
                }
            });
            
            return {
                success: true,
                chats
            };
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    }

    async createChat(chatData) {
        try {
            const chat = await Chat.create(chatData);
            
            return {
                success: true,
                chat: {
                    id: chat.id,
                    userId: chat.userId,
                    name: chat.name,
                    createdAt: chat.createdAt
                }
            };
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    }
}

module.exports = new ChatService(); 