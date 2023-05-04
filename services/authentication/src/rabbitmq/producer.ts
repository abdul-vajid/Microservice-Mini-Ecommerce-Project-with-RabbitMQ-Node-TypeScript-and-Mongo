import { Channel } from "amqplib";
import { randomUUID } from "crypto";
import config from '../config/rabbitmqQueues'
import EventEmitter from "events";

export default class Producer {
    constructor(private channel: Channel, private replyQueueName: string, private eventEmitter: EventEmitter) { }

    async produceMessage(data: any) {
        const uuid = randomUUID()
        console.log('This is uuid : ', uuid);
        console.log('data from Producer class : ', data);

        this.channel.sendToQueue(
            config.rabbitMq.queues.rpcQueue,
            Buffer.from(JSON.stringify(data)),
            {
                replyTo: this.replyQueueName,
                correlationId: uuid,
                headers: {
                    function: data.operation
                }
            }
        )

        return new Promise((resolve, rejects) => {
            this.eventEmitter.once(uuid, (data) => {
                const reply: any = JSON.parse(data.content.toString());
                resolve(reply)
            })
        })
    }
}