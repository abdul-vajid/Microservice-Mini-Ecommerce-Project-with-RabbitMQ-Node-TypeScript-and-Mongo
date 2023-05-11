import rabbitMQClient from './client'

export default class MessageHandler {
    static async handle(
        operation: string,
        data: any,
        correlationId: string,
        replyTo: string
    ) {
        let response = {}
        switch (operation) {
            case 'register':
                response = 'response from reply consumer message handler in product management';
                break;
            default:
                response = 'Request-key notfound'
                break;
        }

        await rabbitMQClient.produceReply(response, correlationId, replyTo)
    }
}