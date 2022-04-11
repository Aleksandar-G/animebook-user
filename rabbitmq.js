require('dotenv').config()
const amqp = require('amqplib');
const EventEmitter = require('events');

const messageBroker = process.env.MESSAGE_BROKER

// queues to connect to 
const Verifyqueue = 'verify_auhtentication_queue'
const Generatequeue = 'generate_auhtentication_queue'


const rabbitMQChannel = async () =>
    amqp.connect(`amqp://${messageBroker}`)
        .then((connection) => connection.createChannel())
        .then((channel) => {

            channel.assertQueue(Verifyqueue, {
                durable: true
            })

            channel.assertQueue(Generatequeue, {
                durable: true
            })

            channel.prefetch(1)

            channel.responseEmitter = new EventEmitter();

            console.log("connected to rabbitmq");

            return channel
        })



const sendRPCRequest = (channel, message, rpcQueue) => new Promise(resolve => {
    // unique random string
    const correlationId = generateUuid();

    channel.assertQueue("", { exclusive: true, noAck: true })
        .then((queue) => {
            //console.log("here");
            channel.consume(queue.queue, msg =>
                channel.responseEmitter.emit(msg.properties.correlationId, msg.content.toString()),
                { noAck: true })

            channel.responseEmitter.once(correlationId, resolve);

            channel.sendToQueue(rpcQueue,
                Buffer.from(message), {
                correlationId: correlationId,
                replyTo: queue.queue
            });

        })


});

const generateUuid = () => {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}


module.exports.rabbitMQChannel = rabbitMQChannel
module.exports.sendRPCRequest = sendRPCRequest