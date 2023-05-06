import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export default class ReplyConsumer {
    constructor(private channel: Channel, private rpcQueue: string) { }

    async consumeMessages() {
        console.log('Product Service ReplyConsumer: ready to consume messages....', this.rpcQueue);

        this.channel.consume(this.rpcQueue,
            async (message: ConsumeMessage) => {
                console.log('Debug No : 5');
                const { correlationId, replyTo } = message.properties
                console.log('Debug No : 6');
                console.log("correlationId, replyTo : ", correlationId, replyTo);
                const operation = message.properties.headers.function
                console.log("operation ", operation);
                console.log('Debug No : 7');
                if (!correlationId || !replyTo) {
                    console.log('Some properties are missing..');
                } else {
                    console.log('Debug No : 8');
                    console.log('Consumed : ', JSON.parse(message.content.toString()));
                    await MessageHandler.handle(operation, JSON.parse(message.content.toString()), correlationId, replyTo)
                }
            }, {
            noAck: true
        })
    }
}