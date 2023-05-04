import { Channel, ConsumeMessage } from "amqplib";
import { EventEmitter } from "stream";

export default class Consumer {
    constructor(private channel: Channel, private replyQueueName: string, private eventEmitter: EventEmitter) { }

    async consumeMessages() {
        console.log('ready to consume messages....');

        this.channel.consume(this.replyQueueName, (message: ConsumeMessage | null) => {
            if (message) console.log('the reply is ', JSON.parse(message.content.toString()))
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        },{
            noAck: true
        })
    }
}