import { getUserDetails } from '../sevices/messageHandlerServices/getUserDetails';
import { saveUserInfoInDb } from '../sevices/messageHandlerServices/saveUserInfo';
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
                response = await saveUserInfoInDb(data)
                break;
            case 'getUserDetails':
                response = await getUserDetails(data);
                break;
            default:
                response = 'Request-key not found'
                break;
        }

        await rabbitMQClient.produce(response, correlationId, replyTo)
    }
}