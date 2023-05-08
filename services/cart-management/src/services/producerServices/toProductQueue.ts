import config from '../../config/rabbitmqQueues.ts';
import RabbitMQClient from '../../rabbitmq/client.ts';

export const produceForCartDetails = async (cart: any) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("console cart inside produceForCartDetails : ", cart);
            console.log('products:', cart.products);
            console.log('Array.isArray(products):', Array.isArray(cart.products));
            const result = RabbitMQClient.produceAndWaitForReply({
                products: cart.products
            }, config.rabbitMq.queues.productQueue, "getProductDetails");
            console.log("console result inside produceForCartDetails : ", result);
            resolve(result);
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
};
