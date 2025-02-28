# AI Chat

A real-time chat application with AI-powered responses built using Node.js, Express, and Sequelize.

## Features

- Real-time chat with AI responses
- Chat history management
- Multiple chat sessions support
- Message persistence using PostgreSQL
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Getting Started

Follow these steps to set up and run the project:

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Then edit the `.env` file with your database credentials and other configuration settings.

3. Start the development server:
```bash
npm run watch
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

- `GET /api/chat/history/:userId` - Get all chats for a user
- `GET /api/chat/messages/:chatId` - Get all messages in a chat
- `POST /api/chat/message/send` - Send a new message
- `POST /api/chat/create` - Create a new chat

## Environment Variables

Make sure to set the following variables in your `.env` file:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
PORT=3000
```
