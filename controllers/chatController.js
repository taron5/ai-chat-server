const chatService = require('../services/chatService');
const Joi = require('joi');

const createChatSchema = Joi.object({
    userId: Joi.number().required().messages({
        'any.required': 'User ID is required'
    }),
    name: Joi.string().required().messages({
        'string.empty': 'Chat name cannot be empty',
        'any.required': 'Chat name is required'
    })
});

const messageSchema = Joi.object({
    chatId: Joi.number().messages({
        'any.required': 'Chat ID is required'
    }),
    message: Joi.string().required().messages({
        'string.empty': 'Message content cannot be empty',
        'any.required': 'Message content is required'
    })
});

const handleChatMessage = async (req, res) => {
    try {        
        const { error, value } = messageSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map(detail => detail.message)
            });
        }

        const result = await chatService.saveMessage(value);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process chat message' 
        });
    }
};

const getMessagesByChatId = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: 'Chat ID is required'
            });
        }

        const result = await chatService.getMessagesByChatId(chatId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch messages'
        });
    }
};

const getAllChats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const result = await chatService.getAllChats(parseInt(userId));
        return res.status(200).json(result);
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch chats'
        });
    }
};

const createChat = async (req, res) => {
    try {
        const { error, value } = createChatSchema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map(detail => detail.message)
            });
        }

        const result = await chatService.createChat(value);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create chat'
        });
    }
};

module.exports = {
    handleChatMessage,
    createChat,
    getAllChats,
    getMessagesByChatId
};
