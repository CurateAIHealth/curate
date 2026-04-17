import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userIds, message, isHighlight } = req.body;

    if (!userIds) {
      return res.status(400).json({ error: "userIds required" });
    }

    if (!message) {
      return res.status(400).json({ error: "message required" });
    }

    
    const usersArray = Array.isArray(userIds) ? userIds : [userIds];

    const results = [];

    for (const userId of usersArray) {
      
      const openRes = await fetch("https://slack.com/api/conversations.open", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: userId }),
      });

      const openData = await openRes.json();

      if (!openData.ok) {
        results.push({ userId, error: openData.error });
        continue;
      }

      
      let payload: any = {
        channel: openData.channel.id,
      };

      if (isHighlight && typeof message === "object") {
       
        payload.blocks = [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${message.title}*`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: message.body,
            },
          },
        ];

        payload.text = message.body;
      } else {
       
        payload.text = message;
      }

      const msgRes = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const msgData = await msgRes.json();

      results.push({ userId, data: msgData });
    }

    return res.status(200).json({ success: true, results });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}