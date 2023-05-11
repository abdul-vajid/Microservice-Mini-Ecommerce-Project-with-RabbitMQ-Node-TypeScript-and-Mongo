import config from '../../config/rabbitmq.config.ts';
import RabbitMQClient from '../../rabbitmq/client.ts';

export const produceForCartDetails = async (cart: any) => {
    return new Promise((resolve, reject) => {
        try {
            const result = RabbitMQClient.produceAndWaitForReply({
                products: cart.products
            }, config.rabbitMq.queues.productQueue, "getProductDetails");
            resolve(result);
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
};
