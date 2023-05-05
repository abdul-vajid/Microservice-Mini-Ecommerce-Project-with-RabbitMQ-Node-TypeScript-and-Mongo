import { Channel, ConsumeMessage } from "amqplib";
import { EventEmitter } from "events";

export default class Consumer {
    constructor(private channel: Channel, private replyQueueName: string, private eventEmitter: EventEmitter) { }

    async consumeMessages() {
        console.log('Auth Service: ready to consume messages....', this.replyQueueName);

        this.channel.consume(this.replyQueueName, (message: ConsumeMessage | null) => {
            console.log("Received data", message);
            
            if (message) console.log('the reply is ', JSON.parse(message.content.toString()))
            console.log(JSON.parse(message.content.toString()), message.properties.correlationId.toString());
            this.eventEmitter.emit(message.properties.correlationId.toString(), message);
        },{
            noAck: true
        })
    }
}
