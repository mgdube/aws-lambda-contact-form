import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});
const TOPIC_ARN = "arn:aws:sns:af-south-1:499305886874:mytopic";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing name, email, or message" }),
      };
    }

    const params = {
      TopicArn: TOPIC_ARN,
      Subject: `New contact form message from ${name}`,
      Message: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await sns.send(new PublishCommand(params));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, message: "Message sent!" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
};
