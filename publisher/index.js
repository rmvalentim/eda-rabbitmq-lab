const express = require('express')
const amqp = require('amqplib')
const crypto = require('crypto')

const app = express()
app.use(express.json())

const APP_PORT = process.env.APP_PORT || 3000
const RABBIT_URL = process.env.RABBIT_URL
const EXCHANGE = 'orders_exchange'

let channel

async function connectRabbit() {
    const connection = await amqp.connect(RABBIT_URL)
    channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true })
    console.log('Connected to RabbitMQ.')
}

app.post('/order', async (req, res) => {

    try {
        const order = {
            id: crypto.randomUUID(),
            customer: req.body.customer,
            email: req.body.email,
            value: req.body.value
        }

        channel.publish(
            EXCHANGE,
            'order.created',
            Buffer.from(JSON.stringify(order))
        )

        console.log('Order published: ', order)
        res.status(201).json({ message: 'Order created', order })
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: 'Bad request'})
    }

})

app.listen(APP_PORT, async () => {
    await connectRabbit()
    console.log(`Publisher running on port ${APP_PORT}`)
})