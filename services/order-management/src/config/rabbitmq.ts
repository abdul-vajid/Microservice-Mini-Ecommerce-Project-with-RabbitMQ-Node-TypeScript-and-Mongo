interface RabbitMQ {
    url: string;
    exchangeName: string;
}

export const rabbitMQConfig: RabbitMQ = {
    url: "amqp://admin:password@rabbitmq:5672/",
    exchangeName: "logExchange",
};