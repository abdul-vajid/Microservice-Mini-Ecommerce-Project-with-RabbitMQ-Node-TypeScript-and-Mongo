import { getProductDetails } from '../services/messageHandlerServices/getProductDetails';
import rabbitMQClient from './client'

export default class MessageHandler {
    static async handle(
        operation: string,
        data: any,
        correlationId: string,
        replyTo: string
    ) {
        let response: any = {}
        switch (operation) {
            case 'getProductDetails':
                response = await getProductDetails(data.products)
                break;
            default:
                response = 'Request-key notfound'
                break;
        }
        await rabbitMQClient.produceReply(response, correlationId, replyTo)
    }
}