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
        console.log('the operation is', operation);
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