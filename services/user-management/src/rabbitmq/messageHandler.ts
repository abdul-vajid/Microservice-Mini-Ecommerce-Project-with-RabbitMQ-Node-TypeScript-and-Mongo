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
        console.log('the operation is', operation);
        switch (operation) {
            case 'register':
                response = await saveUserInfoInDb(data)
                break;
            case 'removeUser':
                response = 'user removed'
                console.log('user removed n test case');
                break;
            default:
                response = 'default worked'
                break;
        }

        await rabbitMQClient.produce(response, correlationId, replyTo)
    }
}