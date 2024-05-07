import { Request, Response } from "express";
import {
  readSubscriptionsData,
  writeIntoSubscriptions,
} from "../utils/fileUtils";

export const deleteSubscription = (request: Request, response: Response) => {
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

  if (isSubscriptionAlreadyExists) {
    const index = subscriptions.findIndex(
      (sub) => sub.category === category && sub.user_id === user_id
    );
    subscriptions.splice(index, 1);
    writeIntoSubscriptions(subscriptions);
  }
  return response.status(200).json({
    message: `You are successfully un subscribed to ${category}`,
    status: 200,
  });
};
