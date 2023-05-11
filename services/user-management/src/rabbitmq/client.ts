import { Channel, Connection, connect } from 'amqplib'
import config from '../config/rabbitmq.config'
import Consumer from './consumer';
import Producer from './producer';

class RabbitMQClient {

    private constructor(){};

    private static instance: RabbitMQClient; 
    private isInitialized: boolean = false;
    private producer: Producer;
    private consumer: Consumer;
    private replyConsumer: Consumer;
    private connection: Connection;
    private producerChannel: Channel;
    private consumerChannel: Channel;

    public static getInstance(){
        if(!this.instance){
            this.instance = new RabbitMQClient();
        }
        return this.instance;
    }

    async initialize() {
        if(this.isInitialized){
            return;
        }
        try {
            this.connection = await connect(config.rabbitMq.url);

            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            const { queue: queue } = await this.consumerChannel.assertQueue(config.rabbitMq.queues.userQueue, { exclusive: true });
            const { queue: replayQueue } = await this.consumerChannel.assertQueue('', { exclusive: true });
            this.producer = new Producer(this.producerChannel)
            this.consumer = new Consumer(this.consumerChannel, queue);
            this.replyConsumer = new Consumer(this.consumerChannel, replayQueue);

            this.consumer.consumeMessages()
            this.isInitialized = true;
        } catch (error) {
            console.error('** rabbitmq error...', error)
        }
    }

    async produce(data: any, correlationId: string, replyToQueue: string) {
        if(!this.isInitialized){
            await this.initialize()
        }
        return await this.producer.produceMessage(data, correlationId, replyToQueue);
    }
}

export default RabbitMQClient.getInstance()