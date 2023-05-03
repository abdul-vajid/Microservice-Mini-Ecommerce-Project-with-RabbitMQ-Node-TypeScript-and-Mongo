import { Channel, Connection, connect } from 'amqplib'
import config from '../config/rabbitmqQueues'
import Consumer from './consumer';
import Producer from './producer';
import { rabbitMQConfig } from '../config/rabbitmq';

class RabbitMQClient {

    private constructor(){};

    private static instance: RabbitMQClient; 
    private isInitialized: boolean = false;

    private producer: Producer;
    private consumer: Consumer;
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

            const { queue: replyQueueName } = await this.consumerChannel.assertQueue('', { exclusive: true });

            this.producer = new Producer(this.producerChannel, replyQueueName)
            this.consumer = new Consumer(this.consumerChannel, replyQueueName);

            this.consumer.consumeMessages()
            this.isInitialized = true;
        } catch (error) {
            console.error('** rabbitmq error...', error)
        }
    }

    async produce(data: any) {
        if(!this.isInitialized){
            await this.initialize()
        }
        return await this.producer.produceMessage(data);
    }
}

export default RabbitMQClient.getInstance()