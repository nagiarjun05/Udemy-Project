//   products: products
const Product = require('../models/product');
const Cart=require('../models/cart');
const ITEM_PER_PAGE=2;
const Order=require('../models/order');

exports.getProducts = (req, res, next) => {
  const page= +req.query.page || 1;
  let totalCount;
  Product.count()
  .then((total)=>{
    totalCount=total;
    return Product.findAll({
      offset: (page-1)*ITEM_PER_PAGE,
      limit:ITEM_PER_PAGE
    })
  })
  .then((products)=>{
    // console.log(products)
    res.json({
      products:products,
      currentPage:page,
      hasNextPage:ITEM_PER_PAGE*page<totalCount,
      nextPage:page+1,
      hasPreviousPage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(totalCount/ITEM_PER_PAGE)
    })
  })
  // Product.findAll()
  // .then((products)=>{
  //   // res.json({products, success:true})
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  // })
  .catch(err=>{
    console.log(err);
  })
};

exports.getProduct=(req, res, next)=>{
  const prodId=req.params.productId;
  // Product.findAll({where:{id: prodId}})
  // .then((products)=>{
  //   res.render('shop/product-detail',{
  //     product: products[0],
  //     pageTitle: products[0].title,
  //     path: '/products'
  //     })
  // })
  // .catch(err=>console.log(err))
  
  Product.findByPk(prodId)
  .then((product)=>{
    res.render('shop/product-detail',{
      product: product,
      pageTitle: product.title,
      path: '/products'
      })
    }
  )
  .catch(err=>console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {
  req.user.getCart() 
  .then(cart=>{
    return cart.getProducts().then(products=>{
      res.json({products, success:true})
    //   // res.render('shop/cart', {
      //   path: '/cart',
      //   pageTitle: 'Your Cart',
      });
    }).catch(err=>console.log(err))
  }
  // )
//   .catch(err=>console.log(err));
// };

exports.postCart=(req, res, next)=>{
  // console.log(req.body);
  // const prodId=req.body.productId;
  const prodId=req.body.id
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart=>{
    fetchedCart=cart
    return cart.getProducts({where:{id:prodId}});
  })
  .then(products=>{
    let product;
    if (products.length>0){
      product=products[0];
    }
    if(product){
      const oldQuantity=product.cartItem.quantity;
      newQuantity=oldQuantity+1;
      return product;
    }
    return Product.findByPk(prodId)
  })
  .then(product=>{
    return fetchedCart.addProduct(product, {
      through:{quantity:newQuantity}
    });
  })
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user
  .getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    const product=products[0];
    return product.cartItem.destroy();
  })
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err))    
};

exports.postOrder = (req, res, next) => {
  req.user
  .getCart()
  .then(cart=>{
    return cart.getProducts()
  })
  .then(products=>{
    return req.user.createOrder()
    .then((order)=>{
      return order.addProducts(
        products.map(product=>{
          product.orderItem={quantity: product.cartItem.quantity};
          return product;
        })
      );
    })
  })
  .then(products=>{
    res.json({products, success:true})
    // products.forEach(element => {
    //   let oId=element.dataValues.orderId;
    //   res.json({oId, success:true})
    // });
  })
  .catch(err=>console.log(err)) 
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
  console.log(req.body.productId);
  res.redirect('/cart')
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
