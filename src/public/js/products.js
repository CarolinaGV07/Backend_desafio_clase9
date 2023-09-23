function addToCart(product_id) {
    fetch(`/api/carts/cart/${cartId.cid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id }) 
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.status === 'success') {
            alert('Product added to cart');
        } else {
            alert('Failed to add product to cart')
        }
    })
    .catch(error => {
        console.error('Error:', error)
        alert('Failed to add product to cart')
    })
}