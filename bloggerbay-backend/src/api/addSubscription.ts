import { Request, Response } from "express";
import {
  readSubscriptionsData,
  writeIntoSubscriptions,
} from "../utils/fileUtils";
import { v4 as uuidv4 } from "uuid";

export const addSubscription = (request: Request, response: Response) => {
  const { user_id, category } = request.body;
  if (!user_id || !category) {
    return response.status(200).json({
      message: "user_id and category are needed",
      status: 400,
    });
  }

  const subscriptions = readSubscriptionsData();

  const isSubscriptionAlreadyExists =
    subscriptions.findIndex(
      (sub) => sub.category === category && sub.user_id === user_id
    ) !== -1;

  if (!isSubscriptionAlreadyExists) {
    subscriptions.push({
      id: uuidv4(),
      user_id,
      category,
      time_stamp: new Date(),
    });
    writeIntoSubscriptions(subscriptions);
  }
  return response.status(200).json({
    message: `You are successfully subscribed to ${category}`,
    status: 200,
  });
};
