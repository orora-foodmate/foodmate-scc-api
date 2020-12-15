const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const yup = require('yup');
const { eventModel, eventUserModel, commentModel } = require('../models');
const { getConditionByQuery } = require('../helpers/utils');
const isEmpty = require('lodash/isEmpty');
const { now } = require('../helpers/dateHelper');

router.get('/', async (req, res) => {
  try {
    const { user } = req;
    const condition = getConditionByQuery(req.query);

    const events = await eventModel.findEvents({
      // "users.info": { $in: [user.id] },
      ...condition,
    })
    return res.status(200).json({
      success: true,
      data: { events },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

const validateAlreadyJoin = (event, user) => {
  const result = event.users.find(u => u.info.id.toString() === user.id.toString());
  return Boolean(result);
};

router.post('/leave/:eventId', async (req, res) => {
  try {
    const { user } = req;
    const { eventId } = req.params;

    const event = await eventModel.findEventById(eventId);
    if (isEmpty(event)) {
      throw new Error('活動不存在');
    }

    const alreadyJoin = validateAlreadyJoin(event, user);
    if (!alreadyJoin) {
      throw new Error('尚未加入活動');
    }

    await eventModel.update({ _id: eventId }, { $pull: { users: { info: user.id } } });
    const updatedEvent = await eventModel.findEventById(eventId);

    const result = updatedEvent.toJSON();
    result.users = result.users.map(u => {
      const { regId, ...nextUser } = u;
      return nextUser;
    });

    req.exchange.transmitPublish(`event.updated`, result);

    return res.status(200).json({
      success: true,
      data: { event: result },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

router.post('/:eventId/reject/:userId', async (req, res) => {
  try {
    const { user } = req;
    const { eventId, userId } = req.params;

    const event = await eventModel.findEventById(eventId);
    if (isEmpty(event)) {
      throw new Error('活動不存在');
    }

    if (event.creator.id !== user.id) {
      throw new Error('只有建立者才能審查會員');
    }

    const alreadyJoin = validateAlreadyJoin(event, { id: userId });
    if (!alreadyJoin) {
      throw new Error('尚未加入活動');
    }
    await eventModel.update({ _id: eventId }, { $pull: { users: { info: userId } } });
    const updatedEvent = await eventModel.findEventById(eventId);

    const result = updatedEvent.toJSON();
    result.users = result.users.map(u => {
      const { regId, ...nextUser } = u;
      return nextUser;
    });

    req.exchange.transmitPublish(`event.updated`, result);

    return res.status(200).json({
      success: true,
      data: { event: result },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

router.post('/:eventId/validate/:userId', async (req, res) => {
  try {
    const { user } = req;
    const { eventId, userId } = req.params;

    const event = await eventModel.findEventById(eventId);
    if (isEmpty(event)) {
      throw new Error('活動不存在');
    }

    if (event.creator.id.toString() !== user.id.toString()) {
      throw new Error('只有主揪可以審核');
    }

    const needValidateUserIndex = event.users.findIndex(u => u.info.id.toString() === userId);
    if (needValidateUserIndex === -1) {
      throw new Error('會員未參加此活動');
    }

    event.users[needValidateUserIndex].status = 1;
    await event.save();
    const updatedEvent = await eventModel.findEventById(eventId);

    req.exchange.transmitPublish(`event.updated`, event.toJSON());

    return res.status(200).json({
      success: true,
      data: { event: updatedEvent },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

router.post('/:eventId', async (req, res) => {
  try {
    const { user } = req;
    const { eventId } = req.params;

    const event = await eventModel.findEventById(eventId);
    if (isEmpty(event)) {
      throw new Error('活動不存在');
    }
    const alreadyJoin = validateAlreadyJoin(event, user);
    if (alreadyJoin) {
      throw new Error('已經加入活動');
    }
    const eventUser = new eventUserModel({
      info: user.id,
      status: 0,
    });
    event.users.push(eventUser);
    await event.save();

    const updatedEvent = await eventModel.findEventById(eventId);
    const result = updatedEvent.toJSON();
    // result.users = result.users.map(user => {
    //   const {regId, ...nextUser} = user;
    //   publishMessage({ token: regId, notification: { title: ' 有新成員加入', body: '' } });
    //   return nextUser;
    // });
    req.exchange.transmitPublish(`event.updated`, result);

    return res.status(200).json({
      success: true,
      data: { event: result },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

const createEventSchema = yup.object().shape({
  title: yup.string().required('title 不可為空'),
  logo: yup.string().required("logo 不可為空"),
  users: yup.array(),
  publicationPlace: yup.string().required("publicationPlace 不可為空"),
  description: yup.string().required("description 不可為空"),
  place: yup.object({
    description: yup.string().required("description 不可為空"),
    place_id: yup.string().required("place_id 不可為空"),
    structured_formatting: yup.object().shape({
      main_text: yup.string().required('main_text 不可為空'),
      secondary_text: yup.string().required('secondary_text 不可為空'),
    }),
  }).required("place 不可為空"),
  type: yup.mixed().oneOf([0, 1, 2]),
  status: yup.mixed().oneOf([0, 1, 2]),
  paymentMethod: yup.mixed().oneOf([0, 1, 2]),
  budget: yup.number().positive('必須是正整數'),
  finalReviewAt: yup.date().required('finalReviewAt 不可為空'),
  datingAt: yup.date().required('datingAt 不可為空'),
});

router.post('/', async (req, res) => {
  try {
    const { user, body } = req;
    const { users = [], place } = body;

    await createEventSchema.validate(body);
    const eventId = new mongoose.Types.ObjectId();

    await new eventModel({
      ...body,
      _id: eventId,
      creator: user.id,
      users: [
        ...users.map(userId => ({ info: userId, status: 0 })),
        { info: user.id, status: 1 },
      ],
      place: {
        terms: [],
        ...place,
      }
    }).save();

    const result = await eventModel.findEventById(eventId);
    const event = result.toJSON();

    req.exchange.transmitPublish(`event.created`, event);

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});


const createCommentSchema = yup.object().shape({
  content: yup.string().required('content 不可為空'),
});

router.post('/:eventId/comments', async (req, res) => {
  try {
    const { user, body } = req;
    await createCommentSchema.validate(body);
    if (isEmpty(body.content)) {
      throw new Error("content 不可為空");
    }

    const { eventId } = req.params;

    const event = await eventModel.findEventById(eventId);
    if (isEmpty(event)) {
      throw new Error('活動不存在');
    }

    const newComment = new commentModel({
      status: 0,
      createAt: now(),
      updateAt: now(),
      content: body.content,
      sender: user.id,
    });

    await eventModel.update({ _id: eventId }, { $push: { comments: newComment } });

    const comment = {
      ...newComment.toJSON(),
      sender: {
        id: user.id,
        account: user.account,
        avatar: user.avatar,
        name: user.name,
      }
    };

    req.exchange.transmitPublish(`event.add.comment`, comment.toJSON());

    return res.status(200).json({
      success: true,
      data: { comment },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});


router.get('/:eventId/comments', async (req, res) => {
  try {
    const { user } = req;
    const { eventId } = req.params;

    const event = await eventModel.findComments(eventId, req.query);
    if (isEmpty(event)) {
      throw new Error('活動不存在');
    }

    return res.status(200).json({
      success: true,
      data: {
        comments: event
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});


module.exports = router;
