import { Channel, Connection, connect } from 'amqplib'
import config from '../config/rabbitmqQueues'
import EmitingConsumer from './emitingConsumer';
import Producer from './producer';
import { EventEmitter } from 'events';
import ReplyConsumer from './ReplyConsumer';

class RabbitMQClient {

    private constructor() { };

    private static instance: RabbitMQClient;
    private isInitialized: boolean = false;

    private producer: Producer;
    private replyConsumer: ReplyConsumer;
    private emitingConsumer: EmitingConsumer;
    private connection: Connection;
    private producerChannel: Channel;
    private consumerChannel: Channel;

    private eventEmitter: EventEmitter

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RabbitMQClient();
        }
        return this.instance;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await connect(config.rabbitMq.url);

            this.eventEmitter = new EventEmitter();
            
            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            const { queue: queue } = await this.consumerChannel.assertQueue(config.rabbitMq.queues.orderQueue, { exclusive: true });
            const { queue: replyQueueName } = await this.consumerChannel.assertQueue('', { exclusive: true });

            this.producer = new Producer(this.producerChannel, replyQueueName, this.eventEmitter);
            this.replyConsumer = new ReplyConsumer(this.consumerChannel, queue);
            this.emitingConsumer = new EmitingConsumer(this.consumerChannel, replyQueueName, this.eventEmitter);

            this.emitingConsumer.consumeMessages()
            this.replyConsumer.consumeMessages()
            this.isInitialized = true;
        } catch (error) {
            console.error('** rabbitmq error...', error)
        }
    }

    async produceAndWaitForReply(data: any, targetQueue: string, operation: string) {
        if (!this.isInitialized) {
            console.log("Not initialized");

            await this.initialize()
        }
        console.log('Debug No : 2');
        return await this.producer.waitingProducer(data, targetQueue, operation);
    }

    async produceReply(data: any, correlationId: string, replyToQueue: string) {
        if (!this.isInitialized) {
            await this.initialize()
        }
        return await this.producer.produceToReplyQue(data, correlationId, replyToQueue);
    }
}

export default RabbitMQClient.getInstance()