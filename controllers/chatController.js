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
    chatId: Joi.string().messages({
        'string.empty': 'Chat ID cannot be empty',
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
        res.json(result);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process chat message' 
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
        res.json(result);
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
        res.status(201).json(result);
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
    getAllChats
};
