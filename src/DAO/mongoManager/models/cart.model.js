import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    products: {
        type: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'products'
                },
                quantity: Number

            }
        ]

    }

})

const cartModel = mongoose.model('carts', cartSchema)

export default cartModel