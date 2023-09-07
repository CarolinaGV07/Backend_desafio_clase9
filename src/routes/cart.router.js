
import { Router } from 'express'
import CartModel from '../DAO/mongoManager/models/cart.model.js'

const router = Router()

router.get('/', async (req, res) => {
    const findCart = await CartModel.find()
    res.send(findCart)
})
router.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    const cart = await CartModel.findById(cid)
    res.send(cart)
})

router.post('/', async (req, res) => {
    const result = await CartModel.create({ products: [] })
    res.send(result)
})

//Add product to cart
router.post('/:cid/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.query.quantity || 1

    try {
        const cart = await CartModel.findById(cid)

        if (!cart) {
            return res.status(404).send({
                error: "Carrito no encontrado"
            })
        }

        cart.products.push({
            id: pid,
            quantity
        })

        const result = await cart.save()

        res.send(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({
            error: "Error al agregar producto al carrito"
        })
    }
})


export default router