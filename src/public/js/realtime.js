const socket = io();

// Escuchamos el evento 'updateProducts'
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 
    
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${product.title}</strong> - $${product.price} <br> <small>Código: ${product.code}</small> `;
        
        // --- BOTÓN EDITAR ---
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Editar';
        editBtn.style.marginLeft = '15px';
        editBtn.style.color = 'white';
        editBtn.style.backgroundColor = '#007bff'; // Azul Bootstrap
        editBtn.style.border = 'none';
        editBtn.style.padding = '5px 10px';
        editBtn.style.cursor = 'pointer';
        editBtn.style.borderRadius = '3px';

        editBtn.addEventListener('click', () => {
            // Llenamos el formulario con los datos del producto
            document.getElementById('productId').value = product._id;
            document.getElementById('title').value = product.title;
            document.getElementById('description').value = product.description;
            document.getElementById('code').value = product.code;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;
            document.getElementById('category').value = product.category;

            // Cambiamos el texto del botón
            document.getElementById('submitBtn').innerText = 'Actualizar Producto';
        });

        // --- BOTÓN ELIMINAR ---
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Eliminar';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.style.color = 'white';
        deleteBtn.style.backgroundColor = '#dc3545';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.borderRadius = '3px';

        deleteBtn.addEventListener('click', () => {
            socket.emit('deleteProduct', product._id);
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
});

// Capturamos el envío del formulario
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const productId = document.getElementById('productId').value;
    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value
    };

    if (productId) {
        // Si el campo oculto tiene un ID, es una actualización
        socket.emit('updateProduct', { id: productId, data: productData });
    } else {
        // Si está vacío, es un producto nuevo
        socket.emit('newProduct', productData);
    }
    
    // Limpiamos los inputs y reseteamos el botón
    e.target.reset();
    document.getElementById('productId').value = '';
    document.getElementById('submitBtn').innerText = 'Agregar Producto';
});