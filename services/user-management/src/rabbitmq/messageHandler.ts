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
            case 'addUser':
                response = 'user added'
                console.log('user added in test case....');
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