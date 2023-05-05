import { Channel, Connection, connect } from 'amqplib'
import config from '../config/rabbitmqQueues'
import Consumer from './consumer';
import Producer from './producer';
import { EventEmitter } from 'events';

class RabbitMQClient {

    private constructor() { };

    private static instance: RabbitMQClient;
    private isInitialized: boolean = false;

    private producer: Producer;
    private consumer: Consumer;
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

            const { queue: replyQueueName } = await this.consumerChannel.assertQueue('', { exclusive: true });

            this.producer = new Producer(this.producerChannel, replyQueueName, this.eventEmitter);
            this.consumer = new Consumer(this.consumerChannel, replyQueueName, this.eventEmitter);

            this.consumer.consumeMessages()
            this.isInitialized = true;
        } catch (error) {
            console.error('** rabbitmq error...', error)
        }
    }

    async produce(data: any, targetQueue: string, operation: string) {
        if (!this.isInitialized) {
            console.log("Not initialized");
            
            await this.initialize()
        }
        console.log("Producing data");
        return await this.producer.produceMessage(data, targetQueue, operation);
    }
}

export default RabbitMQClient.getInstance()