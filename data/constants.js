const MARKETS = [
  {
    name: "Extrabom",
    url: "https://www.extrabom.com.br/busca/?q=",
    selectors: {
      productNameSelector: ".name-produto",
      productPriceSelector: ".item-por__val",
      productImageSelector: ".carousel__img",
    },
  },
  {
    name: "Perim",
    url: "https://www.perim.com.br/busca?termo=",
    selectors: {
      productNameSelector: 'span[data-cy="produto-descricao"]',
      productPriceSelector: 'span[data-cy="preco"]',
      productImageSelector: 'vip-image[data-cy^="card_produto_"] img',
    },
  }
];

const SEARCH_TERMS = [
  "leite 1L",
  "arroz kg",
  "feijao kg",
  "cafe 500g",
  "acucar kg",
  "sal refinado",
  "oleo de soja",
  "farinha de mandioca",
  "farinha de trigo",
  "macarrao instantaneo",
  "frango kg",
];

export { MARKETS, SEARCH_TERMS };
