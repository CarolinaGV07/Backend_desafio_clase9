import { Router } from 'express'
import ProductManager from '../DAO/fileManager/ProductManager.js'
import chatModel from '../DAO/mongoManager/models/chat.model.js'
import ProductModel from '../DAO/mongoManager/models/product.model.js'
import cartModel from '../DAO/mongoManager/models/cart.model.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', (req, res) => {
    res.render('index', { css: 'index' })
})

router.get('/home', async (req, res) => {
    const page = parseInt(req.query?.page || 1)
    const limit = parseInt(req.query?.limit || 15)
    const sort = req.query.sort || 'asc'
    const queryParams = req.query?.query || ''
    const query = {}
    if(query){
        const field = queryParams.split(',')[0]
        let value = queryParams.split(',')[1]  //con estos query puedo ir variando la paginacion segun atributos /list?limit=6&page=1&query=price,9000 (limite de productos por pagina, nª de pagina y entra por queryParam atributo y valor (field y value))

        if(!isNaN(parseInt(value))) value = parseInt(value)

        query [field] = value
    }

    try {
        const result = await ProductModel.paginate(query, {
            page,
            limit,
            lean: true,
            sort

           
        })
        res.render('home', {result, css: 'home'}) //result o products? o ambos?
        
     //  const totalPages = Math.ceil(result.totalCount / limit); 
       // const hasPrevPage = page > 1;
       // const hasNextPage = page < totalPages;

       // const response = {
        //    status: 'success',
        //    payload: result.products,
        //    totalPages,
        //    prevPage: hasPrevPage ? page - 1 : null,
        //    nextPage: hasNextPage ? page + 1 : null,
        //    page,
        //    hasPrevPage,
        //    hasNextPage,
        //    prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        //    nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null


        //res.status(200).json(response)

    } catch (error) {
        res.status(500).json({ error:'Failed to get products'});
    }
})

router.get('/products', async (req, res) => {
    const products = await ProductModel.find().lean().exec()
    res.render('products', {products, css: 'products'} )
})

router.get('/cart', async (req, res) => {
    const carts = await cartModel.find().lean().exec()
    res.render('cart', {carts, css: 'cart'} )
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
        const messages = await chatModel.find()
        res.render('chat', { messages, css:'chat'})
    } catch (error) {
        console.error('Failed to get messages', error)
        res.status(500).send('Failed to get messages from chat')
    }
})

export default router