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
                console.log("insside message handler, case : getCartDetails, consoling data : ", data)
                console.log("insside message handler, case : getCartDetails, consoling data.userId : ", data.userId)
                response = await getProductDetails(data);
                break;
            case 'removeUser':
                response = 'user removed'
                console.log('user removed n test case');
                break;
            default:
                response = 'default worked'
                break;
        }

        await rabbitMQClient.produceReply(response, correlationId, replyTo)
    }
}