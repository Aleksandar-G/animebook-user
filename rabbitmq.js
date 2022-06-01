require("dotenv").config();
const amqp = require("amqplib");
const EventEmitter = require("events");

const messageBroker = process.env.MESSAGE_BROKER;
console.log(messageBroker);
// queues to connect to
const Verifyqueue = "verify_auhtentication_queue";
const Generatequeue = "generate_auhtentication_queue";
let ReplyQueue = "reply-to-";

const rabbitMQChannel = async () =>
  amqp
    .connect(`${messageBroker}`)
    .then((connection) => connection.createChannel())
    .then((channel) => {
      channel.responseEmitter = new EventEmitter();
      channel.responseEmitter.setMaxListeners(0);

      generateReplyQueue();

      channel.assertQueue(Verifyqueue, {
        durable: true,
      });

      channel.assertQueue(Generatequeue, {
        durable: true,
      });

      channel.assertQueue(ReplyQueue, { exclusive: true }).then(() => {
        channel.consume(
          ReplyQueue,
          (msg) => {
            channel.responseEmitter.emit(
              msg.properties.correlationId,
              msg.content.toString()
            );
          },

          { noAck: true }
        );
      });

      console.log(ReplyQueue);

      console.log("connected to rabbitmq");

      return channel;
    });

const sendRPCRequest = (channel, message, rpcQueue) =>
  new Promise((resolve) => {
    // unique random string
    const correlationId = generateUuid();

    channel.responseEmitter.once(correlationId, resolve);
    channel.sendToQueue(rpcQueue, Buffer.from(message), {
      correlationId,
      replyTo: ReplyQueue,
    });
  });

const generateReplyQueue = () => {
  ReplyQueue += crypto.randomUUID();
};

const generateUuid = () => {
  return crypto.randomUUID().toString() + crypto.randomUUID().toString();
};

module.exports.rabbitMQChannel = rabbitMQChannel;
module.exports.sendRPCRequest = sendRPCRequest;
module.exports.Verifyqueue = Verifyqueue;
module.exports.Generatequeue = Generatequeue;
