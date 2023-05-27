const detalhesProduto = document.getElementById("detalhes-produto");
const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');
console.log(produtoId);

async function fetchProduto() {
    const res = await fetch(`https://market-api-ten.vercel.app/all`);
    const data = await res.json();

    const product = data.filter(product => product.name === produtoId);

    console.log(product);
  
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const image = document.createElement("img");
    image.src = product[0].image;
    image.classList.add('product-image');
    detalhesProduto.appendChild(image);

    const titulo = document.createElement("h1");
    titulo.textContent = product[0].name;
    titulo.classList.add('product-title');
    productDiv.appendChild(titulo);

    const preco = document.createElement("p");
    preco.textContent = `R$${product[0].price.toString().replace('.', ',')}`;
    preco.classList.add('product-price');
    productDiv.appendChild(preco);

    const market = document.createElement("p");
    market.textContent = `Preço mais baixo no supermecado ${product[0].market}`;
    market.classList.add('product-market');
    productDiv.appendChild(market);

    detalhesProduto.appendChild(productDiv);
  }
  
  fetchProduto();
  