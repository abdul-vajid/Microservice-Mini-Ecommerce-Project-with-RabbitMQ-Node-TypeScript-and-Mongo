import { getProductDetails } from '../services/messageHandlerServices/getCartDetails';
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
            case 'getCartDetails':
                response = await getProductDetails(data);
                break;
            default:
                response = 'Request-key notfound'
                break;
        }

        await rabbitMQClient.produceReply(response, correlationId, replyTo)
    }
}