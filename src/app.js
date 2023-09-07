import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import chatModel from './DAO/mongoManager/models/chat.model.js'
import productModel from './DAO/mongoManager/models/product.model.js'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import __dirname from './utils.js'

const app = express()
app.use('/static', express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

const runServer = () => {
  const httpServer = app.listen(8080, () => console.log('Listening...'))
  const io = new Server(httpServer)

  io.on('connection', socket => {
    socket.on('new-product', async data => {
      try {
        const products = await productModel.create(data)
        io.emit('reload-table', products)
      } catch (error) {
        console.error('Failed to save product', error)
      }
    })

    socket.on('deleteProduct', async (productId) => {
      try {
        await productModel.findByIdAndDelete(productId);
        io.emit('deleting-product', productId);
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    })

    socket.on('new', user => console.log(`${user} is connected`))

    socket.on('message', async (data) => {
      try{
        await chatModel.create(data)
        const messages = await chatModel.find().lean().exec()
        console.log(messages)
        io.emit('logs', messages)
       
      }catch (error) {
        console.error('Failed to save messages', error);
      }
      
    })

  })

}

const URL = 'mongodb+srv://CarolinaCoderDB:3992coderbd@coderclustercgv.kecc4uv.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
console.log('Connecting...')
mongoose.connect(URL, {
  dbName: 'ecommerce'
})
  .then(() => {
    console.log('DB connected')
    runServer()
  })
  .catch(e => console.log('Can`t connect to DB'))

