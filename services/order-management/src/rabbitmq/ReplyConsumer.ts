import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export default class ReplyConsumer {
    constructor(private channel: Channel, private rpcQueue: string) { }

    async consumeMessages() {
        this.channel.consume(this.rpcQueue,
            async (message: ConsumeMessage) => {
                const { correlationId, replyTo } = message.properties
                const operation = message.properties.headers.function
                if (!correlationId || !replyTo) {
                    console.log('Some properties are missing..');
                } else {
                    await MessageHandler.handle(operation, JSON.parse(message.content.toString()), correlationId, replyTo)
                }
            }, {
            noAck: true
        })
    }
}