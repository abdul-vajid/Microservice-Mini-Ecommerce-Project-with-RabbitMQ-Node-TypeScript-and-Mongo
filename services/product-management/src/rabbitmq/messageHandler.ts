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
        console.log('the operation is', operation);
        console.log('Debug No : 9');
        switch (operation) {
            case 'getProductDetails':
                response = await getProductDetails(data.products)
                break;
            case 'test':
                console.log('Debug No : 10');
                response = 'test'
                console.log('user removed n test case');
                break;
            default:
                response = 'default worked'
                break;
        }
        await rabbitMQClient.produceReply(response, correlationId, replyTo)
    }
}