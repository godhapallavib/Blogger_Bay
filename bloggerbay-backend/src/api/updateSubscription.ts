import { Request, Response } from "express";
import {
  readSubscriptionsData,
  writeIntoSubscriptions,
} from "../utils/fileUtils";

export const updateSubscription = (request: Request, response: Response) => {
  const { user_id } = request.body;
  if (!user_id) {
    return response.status(200).json({
      message: "user_id is needed",
      status: 400,
    });
  }

  const subscriptions = readSubscriptionsData();

  for (let index = 0; index < subscriptions.length; index++) {
    if (subscriptions[index].user_id === user_id)
      subscriptions[index].time_stamp = new Date();
  }
  writeIntoSubscriptions(subscriptions);
  return response.status(200).json({
    message: `You successfully updated the subscription `,
    status: 200,
  });
};
