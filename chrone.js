// cronJobs.js
const cron = require('node-cron');
const Message = require('./models/messages');
const OldChat = require('./models/archievechat')
const Sequelize = require('sequelize');

async function moveOldChats() {
  try {
   
    const oneDayBefore = new Date();
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    const oldChats = await Message.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: oneDayBefore
        }
      }
    });

    if (oldChats.length > 0) {
      const oldChatData = oldChats.map(chat => ({
        message: chat.message,
        senderId: chat.senderId,
        receiverId: chat.receiverId,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }));

      await OldChat.bulkCreate(oldChatData);
      await Message.destroy({
        where: {
          createdAt: {
            [Sequelize.Op.lt]: oneDayBefore
          }
        }
      });

      console.log(`Moved ${oldChats.length} old chats to OldChat table.`);
    } else {
      console.log('No chats older than 1 day.');
    }
  } catch (error) {
    console.error('Error moving old chats:', error);
  }
}


cron.schedule('0 0 * * *', moveOldChats);

console.log('Cron job scheduled to run daily at midnight.');
