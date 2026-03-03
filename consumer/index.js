const amqp = require('amqplib')

const RABBIT_URL = process.env.RABBIT_URL
const EXCHANGE = 'orders_exchange'
const QUEUE = 'email_queue'

async function start() {
    try {

        const connection = await amqp.connect(RABBIT_URL)
        const channel = await connection.createChannel()

        await channel.assertExchange(EXCHANGE, 'topic', { durable: true })

        const q = await channel.assertQueue(QUEUE, { durable: true })

        await channel.bindQueue(q.queue, EXCHANGE, 'order.created')

        console.log('Waiting for orders...')

        channel.consume(
            q.queue,
            async(msg) => {
                if(msg !== null) {
                    
                    const order = JSON.parse(msg.content.toString())
    
                    console.log('Order received: ', order)
    
                    // Simulate mail sending
                    console.log(`Sending mail to ${order.email}...`)
    
                    await new Promise((resolve) => setTimeout(resolve, 5000))
    
                    console.log('Mail sent.')
    
                    channel.ack(msg)
                }
            },
            { noAck: false }
        )


    } catch (err) {
        console.error(err)
    }
}

start()