import { Channel, Connection, connect } from 'amqplib'
import config from '../config/rabbitmqQueues'
import Consumer from './consumer';
import Producer from './producer';

export default class RabbitMQClient {
    private producer: Producer;
    private consumer: Consumer;
    private connection: Connection;
    private producerChannel: Channel;
    private consumerChannel: Channel;

    async initialize() {
        try {
            this.connection = await connect(config.rabbitMq.url);

            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            const { queue: replyQueueName } = await this.consumerChannel.assertQueue('', { exclusive: true });

            this.producer = new Producer(this.producerChannel, replyQueueName)
            this.consumer = new Consumer(this.consumerChannel, replyQueueName);

            this.consumer.consumeMessages()
        } catch (error) {
            console.error('** rabbitmq error...', error)
        }
    }

    async produce(data: any) {
        if(!this.connection){
            await this.initialize()
        }
        return await this.producer.produceMessage(data);
    }
}