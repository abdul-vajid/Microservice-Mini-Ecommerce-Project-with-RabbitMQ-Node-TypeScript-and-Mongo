import { Channel, connect } from "amqplib";
import {rabbitMQConfig} from '../config/rabbitmq'

class Producer {
  Channel: any;

  async createChannel() {
    const connection = await connect(rabbitMQConfig.url);
    this.Channel = await connection.createChannel();
  }

  async publishMessage(routingKey:string, message:any) {
    if (!this.Channel) {
      await this.createChannel();
    }

    const exchangeName = rabbitMQConfig.exchangeName;
    await this.Channel.assertExchange(exchangeName, "direct");

    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };
    await this.Channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
      `The new ${routingKey} log is sent to exchange ${exchangeName}`
    );
  }
}

export default Producer;