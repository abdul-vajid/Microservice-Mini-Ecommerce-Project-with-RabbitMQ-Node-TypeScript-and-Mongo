import { Channel } from "amqplib";
import { randomUUID } from "crypto";
import config from '../config/rabbitmqQueues'

export default class Producer {
    constructor(private channel : Channel, private replyQueueName: string){}

    async produceMessage(data: any){
        const uuid = randomUUID()
        console.log('This is uuid : ', uuid);

        this.channel.sendToQueue(
            config.rabbitMq.queues.rpcQueue,
            Buffer.from(JSON.stringify(data)),
            {
                replyTo: this.replyQueueName,
                correlationId: uuid
            }
        )
    }
}