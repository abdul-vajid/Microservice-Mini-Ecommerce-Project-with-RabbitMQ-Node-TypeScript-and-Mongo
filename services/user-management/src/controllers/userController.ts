// import { connect } from "amqplib";

// const routingKey = "routing-key";
// const rabbitMQConfig = {
//     url: "amqp://admin:password@rabbitmq:5672/",
//     exchangeName: "authExchange",
// };

// async function main() {
//     const connection = await connect(rabbitMQConfig.url);
//     const channel = await connection.createChannel();

//     await channel.assertExchange(rabbitMQConfig.exchangeName, "direct", { durable: true });

//     const queue = await channel.assertQueue("", { exclusive: true });
//     await channel.bindQueue(queue.queue, rabbitMQConfig.exchangeName, routingKey);

//     console.log("Waiting for messages...");

//     channel.consume(queue.queue, (msg) => {
//         if (msg) {
//             console.log(`Received message: ${msg.content.toString()}`);
//             channel.ack(msg);
//         }
//     });
// }

// main().catch(console.error);

// async function consumeMessages() {
//     const connection = await connect("amqp://admin:password@rabbitmq:5672/");
//     const channel = await connection.createChannel();

//     await channel.assertExchange("logExchange", "direct");

//     const q = await channel.assertQueue("InfoQueue");

//     await channel.bindQueue(q.queue, "logExchange", "Info");

//     channel.consume(q.queue, (msg: any) => {
//         const data = JSON.parse(msg.content);
//         console.log(data);
//         channel.ack(msg);
//     });
// }

// export default consumeMessages()