import { Router } from 'express'
import ProductManager from '../DAO/fileManager/ProductManager.js'
import chatModel from '../DAO/mongoManager/models/chat.model.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', (req, res) => {
    res.render('index', { css: 'index' })
})

router.get('/home', async (req, res) => {
    const products = await productManager.listProducts()
    res.render('home', { products, css: 'home' })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.listProducts()
    res.render('realTimeProducts', { products, css: 'realTimeProducts' })
})

router.get('/form_products', async (req, res) => {
    res.render('form', { css: 'form' })
})

router.post('/form_products', async (req, res) => {
    const data = req.body
    const newProduct = await productManager.createProduct(data)
    res.redirect('/home')
})

router.get('/chat', async (req, res) => {
    try {
        const messages = await chatModel.find();
        res.render('chat', { messages, css:'chat'});
    } catch (error) {
        console.error('Failed to get messages', error);
        res.status(500).send('Failed to get messages from chat');
    }
})

export default router