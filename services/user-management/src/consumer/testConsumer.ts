import {connect} from "amqplib";

async function consumeMessages() {
    try {
        const connection = await connect("amqp://admin:password@rabbitmq:5672").catch((error)=> {
            throw `from connect ${error}`
        });
        const channel = await connection.createChannel().catch((error)=> {
            throw `from createChannel ${error}`
        });
        
        await channel.assertExchange("logExchange", "direct").catch((error)=> {
            throw `from assertExchange ${error}`
        });
       
        const q = await channel.assertQueue("InfoQueue");
        
        await channel.bindQueue(q.queue, "logExchange", "Info").catch((error)=> {
            throw `from bindque ${error}`
        });

        channel.consume(q.queue, (msg: any) => {
            const data = JSON.parse(msg.content);
            console.log(data);
            channel.ack(msg);
        }).catch((error)=> {
            throw `from consume ${error}`
        })
    } catch (error) {
        console.log("error catched : ", error);
    }
}

export default consumeMessages