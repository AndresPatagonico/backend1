const socket = io();

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${product.title}</strong> - $${product.price} <br> <small>Código: ${product.code}</small> `;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Eliminar';
        deleteBtn.style.marginLeft = '15px';
        deleteBtn.style.color = 'white';
        deleteBtn.style.backgroundColor = '#dc3545';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.borderRadius = '3px';

        deleteBtn.addEventListener('click', () => {
            socket.emit('deleteProduct', product._id);
        });

        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
});

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que la página se recargue
    
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value
    };

    // Enviamos el producto nuevo al servidor vía WebSockets
    socket.emit('newProduct', newProduct);
    
    // Limpiamos los inputs
    e.target.reset();
});