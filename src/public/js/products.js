function addToCart(productId) {
    fetch(`/api/carts/${cartId}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId }) 
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.status === 'success') {
            alert('Producto agregado al carrito');
        } else {
            alert('Hubo un error al agregar el producto al carrito')
        }
    })
    .catch(error => {
        console.error('Error:', error)
        alert('Hubo un error al agregar el producto al carrito')
    })
}