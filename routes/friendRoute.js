const express = require("express");
const { friendModel } = require("../models");
const isEmpty = require("lodash/isEmpty");
const { approveFriendTransaction } = require("../helpers/transactions");
const { getConditionByQuery } = require("../helpers/utils");
const { publishMessage } = require('../firebaseNotic/app');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { user } = req;
    const condition = getConditionByQuery(req.query);
    const friends = await friendModel.findFriends({
      status: { $ne: 0 },
      users: { $in: [user.id] },
      ...condition,
    });

    const result = friends.map(item => {
      return {
        ...item.toFriend(user.id.toString()),
        regId: undefined,
        creator: undefined,
      };
    });

    return res.status(200).json({
      success: true,
      data: { friends: result },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

router.post("/approve/:friendId", async (req, res) => {
  const { user } = req;
  const { friendId } = req.params;
  const authUserId = user.id.toString();

  try {
    const friendResult = await approveFriendTransaction(user.id, friendId);

    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    const targetUser = friendResult.users.find(u => u.id.toString() !== authUserId);
    const userId = targetUser.id.toString();
    req.exchange.transmitPublish(`friend.approveFriend.${userId}`, friendResult.toFriend(userId));

    const friend = friendResult.toFriend(req.user.id.toString());

    //Todo: 透過 exchange 溝通 notification
    const { regId } = friend;
    publishMessage({ token: regId, notification: { title: '已經接受交友邀請', body: `${friend.friendCreator.name} 已經成為朋友` } });


    return res.status(200).json({
      success: true,
      data: {
        ...friend,
        regId: undefined,
        creator: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

router.post("/reject/:friendId", async (req, res) => {
  const { friendId } = req.params;
  try {
    const oldRecord = await friendModel.findFriendById(friendId);

    if (isEmpty(oldRecord) || oldRecord.status !== 1) {
      throw new Error("狀態錯誤");
    }

    oldRecord.status = 0;
    const result = await oldRecord.save();


    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    const targetUser = oldRecord.users.find(u => u.id.toString() !== req.user.id.toString());
    const userId = targetUser.id.toString();
    req.exchange.transmitPublish(`friend.rejectFriend.${userId}`, oldRecord.toFriend(userId));

    const friend = result.toFriend(req.user.id.toString());

    //Todo: 透過 exchange 溝通 notification
    const { regId } = friend;
    publishMessage({ token: regId, notification: { title: '交友邀請已被取消', body: `${friend.friendCreator.name} 取消交友邀請` } });


    return res.status(200).json({
      success: true,
      data: {
        ...friend,
        regId: undefined,
        creator: undefined
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

router.post("/delete/:friendId", async (req, res) => {
  const { friendId } = req.params;
  try {
    const oldRecord = await friendModel.findFriendById(friendId);

    console.log('🚀 ~ file: friendRoute.js ~ line 122 ~ router.post ~ oldRecord', oldRecord)
    if (isEmpty(oldRecord) || oldRecord.status !== 2) {
      throw new Error("狀態錯誤");
    }

    oldRecord.status = 0;
    const result = await oldRecord.save();


    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    const targetUser = oldRecord.users.find(u => u.id.toString() !== req.user.id.toString());
    const userId = targetUser.id.toString();
    req.exchange.transmitPublish(`friend.deleteFriend.${userId}`, {
      ...result.toFriend(userId),
      regId: undefined,
      creator: undefined
    });

    const friend = result.toFriend(req.user.id.toString());

    return res.status(200).json({
      success: true,
      data: {
        ...friend,
        regId: undefined,
        creator: undefined
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

router.post("/invite/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const creatorString = req.user.id.toString();

    if (creatorString === userId) {
      throw new Error("邀請者與被邀請者不可相同")
    }

    const users = [userId, creatorString];
    const oldRecord = await friendModel.findFriendByUsers(userId, creatorString);

    if (isEmpty(oldRecord)) {
      await friendModel.create({
        users,
        creator: creatorString,
        status: 1,
      });
    } else {
      if (oldRecord.status === 0) {
        oldRecord.status = 1;
        oldRecord.creator = creatorString;
        await oldRecord.save();
      } else {
        throw new Error('狀態錯誤');
      }
    }

    const friendRecord = await friendModel.findFriendByUsers(userId, creatorString);
    const friend = friendRecord.toFriend(creatorString);
    const { regId } = friend;

    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    req.exchange.transmitPublish(`friend.inviteFriend.${userId}`, friendRecord.toFriend(userId));

    //Todo: 透過 exchange 溝通 notification
    publishMessage({ token: regId, notification: { title: '您收到一個交友邀請', body: `${friend.friendCreator.name} 發送邀請` } });

    return res.status(200).json({
      success: true,
      data: {
        ...friend,
        regId: undefined,
        creator: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

module.exports = router;
