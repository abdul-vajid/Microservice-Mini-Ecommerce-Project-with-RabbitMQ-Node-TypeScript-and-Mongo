export default {
    rabbitMq: {
        url: 'amqp://admin:password@rabbitmq:5672/',
        queues: {
            userQueue: 'user_queue',
            authQueue: 'auth_queue',
            cartQueue: 'cart_queue',
            productQueue: 'product_queue',
            orderQueue: 'order_queue',
        }
    }
}