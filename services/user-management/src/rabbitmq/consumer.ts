import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export default class Consumer {
    constructor(private channel: Channel, private rpcQueue: string) { }

    async consumeMessages() {
        console.log('User Service: ready to consume messages....', this.rpcQueue);

        this.channel.consume(this.rpcQueue,
            async (message: ConsumeMessage) => {
                const { correlationId, replyTo } = message.properties
                console.log("correlationId, replyTo : ", correlationId, replyTo);
                const operation = message.properties.headers.function
                console.log("operation ", operation);
                if (!correlationId || !replyTo) {
                    console.log('Some properties are missing..');
                } else {
                    console.log('Consumed : ', JSON.parse(message.content.toString()));
                    await MessageHandler.handle(operation, JSON.parse(message.content.toString()), correlationId, replyTo)
                }
            }, {
            noAck: true
        })
    }
}