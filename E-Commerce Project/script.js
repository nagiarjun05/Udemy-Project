const cart_items=document.querySelector('#cart .cart-items');

const parent_element=document.querySelector('body');

const pages=document.querySelector('.pagination');

parent_element.addEventListener('click',(e)=>{
    if(e.target.className==='card-btn'){
        const id=e.target.parentNode.parentNode.id;
        const name=e.target.parentNode.parentNode.children[0].innerText;
        const img_src=e.target.parentNode.parentNode.children[1].children[0].src;
        const price=e.target.parentNode.parentNode.children[2].children[0].children[0].innerText;
        // if(document.querySelector(`${id}`)){
        //     alert('You have already selected this item!!!')
        //     return
        // };
        axios({
            method:'post',
            url:`http://3.7.71.210:3000/cart`,
            data:{
                "id":`${id}`,
                "title":`${name} `,
                "img_src":`${img_src}`,
                "price":`${price} `
            }
        })
        .then(res=>{
            document.querySelector('.cart-qnty').innerText=parseInt(document.querySelector('.cart-qnty').innerText)+1;
            const notify=document.getElementById('notify');
            const notification=document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML=`<h4>Your Product : <span>${name}<span> is added to the cart</h4>`;
            notify.appendChild(notification);
            setTimeout(()=>{
                notification.remove()
            },2500);
        })
        .catch(err=>{
            errNotify(err)
        });
    }
    if(e.target.className==='cart-btn'||e.target.className==='cart-btn-bottom'||e.target.className==='cart-bottom'){
        cart_items.innerHTML='';
        document.querySelector('.cart-qnty').innerText='0'
        document.querySelector('#total-value').innerText='0';
        
        axios.get('http://3.7.71.210:3000/cart')
        .then((data)=>{
            data.data.products.forEach((element)=>{
            // console.log(element.cartItem.cartId)
            const id=element.id;
            const name=element.title;
            const img_src=element.imageUrl;
            const price=element.price;
            const qt=element.cartItem.quantity
            // document.querySelector('.cart-qnty').innerText='0';
            let total_price=document.querySelector('#total-value').innerText;
            document.querySelector('.cart-qnty').innerText=parseInt(document.querySelector('.cart-qnty').innerText)+qt;
            const cart_item=document.createElement('div')
            cart_item.classList.add('cart-row');
            cart_item.id=`in-cart-${id}`;
            total_price=parseFloat(total_price)+(parseFloat(price)*qt);
            total_price=total_price.toFixed(2);
            document.querySelector('#total-value').innerText=`${total_price}`
            cart_item.innerHTML=`
            <img class=cart-img src='${img_src}'  alt='' >
            <span class='cart-item cart-column'>
            <span>${name}</span></span>
            <span class='cart-price cart-column'>
            <span>${price}</span></span>
            <span class='cart-quantity cart-column'>
            <input type='text' value='${qt}'>
            <button class='remove' >REMOVE</button>
            </span>
            `
            cart_items.appendChild(cart_item);
            })
        })
        .catch(err=>{
            errNotify(err)
        }) 
        document.querySelector('#cart').style="display:block;"
    }
    if(e.target.className==='cancel'){
        document.querySelector('#cart').style="display:none;"
    }
    if(e.target.className==='remove'){
        // console.log(e.target.parentNode.parentNode.children[3].children[0].value)
        axios({
            method:'post',
            url:`http://3.7.71.210:3000/cart-delete-item/${String(e.target.parentNode.parentNode.id).slice(8)}`,
            data:{
                productId:String(e.target.parentNode.parentNode.id).slice(8),
                quantity:e.target.parentNode.parentNode.children[3].children[0].value
        }
        })
        .then(res=>{
            // res.config.data.slice((res.config.data.search('quantity')+11),-2)

            let total_cart_price=document.querySelector('#total-value').innerText;
            total_cart_price=parseFloat(total_cart_price).toFixed(2)-parseFloat(e.target.parentNode.parentNode.children[1].innerText).toFixed(2);
            document.querySelector('.cart-qnty').innerText=parseInt(document.querySelector('.cart-qnty').innerText)-parseInt(res.config.data.slice((res.config.data.search('quantity')+11),-2))
            document.querySelector('#total-value').innerText=`${total_cart_price.toFixed(2)}`
            const notify=document.getElementById('notify');
            const notification=document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML=`<h4>Your Product : <span>${e.target.parentNode.parentNode.children[1].innerText}<span> is removed from the cart</h4>`;
            notify.appendChild(notification);
            setTimeout(()=>{
                notification.remove()
            },2500);
            e.target.parentNode.parentNode.remove()
        })
        .catch(err=>{
            errNotify(err)
        })
    }
    if (e.target.className=='purchase-btn'){
        // if (parseInt(document.querySelector('.cart-qnty').innerText) === 0){
        //     alert('You have Nothing in Cart , Add some products to purchase !');
        //     return
        // }
        // alert('Thanks for the purchase')
        // cart_items.innerHTML = ""
        // document.querySelector('.cart-qnty').innerText = 0
        // document.querySelector('#total-value').innerText = `0`;
        
        axios({
            method:'post',
            url:`http://3.7.71.210:3000/create-order`,
            })
        .then(res=>{
            let orderId;
            res.data.products.forEach((product)=>{
                orderId=product.orderId;
            })
            const notify=document.getElementById('notify');
            const notification=document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML=`<h4>Thank you for Placing an Order, Your Order ID is <span>${orderId}<span></h4>`;
            notify.appendChild(notification);
            cart_items.innerHTML='';
            document.querySelector('.cart-qnty').innerText='0';
            document.querySelector('#total-value').innerText='0'
            setTimeout(()=>{
                notification.remove()
            },2500);
        }).catch(err=>{
            errNotify(err)
        });
    }
})


function showData(page){
    axios.get(`http://3.7.71.210:3000/products/?page=${page}`)
    .then((data)=>{
        const mainContainer=document.querySelector('#music-content');
        mainContainer.innerHTML='';
        data.data.products.forEach(element => {
            const content=document.createElement('div')
            content.classList.add('content');
            content.id=element.id;
            content.innerHTML=`
            <h3>${element.title}</h3>
            <div class="prod-img">
                <img class="prod-images" src="${element.imageUrl}" alt="">
            </div>
            <div class="detail">
                <span>$<span>${element.price}</span></span>
                <button class="card-btn" type='button'>ADD TO CART</button>
            </div>`
            mainContainer.appendChild(content);
        });
        pagination(data.data.currentPage,data.data.hasNextPage,data.data.nextPage,data.data.hasPreviousPage,data.data.previousPage)
    })
    .catch(err=>{
        errNotify(err)
    })
}

function pagination(currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage){
    pages.innerHTML='';
    if (hasPreviousPage){
        const prevBtn=document.createElement('button')
        prevBtn.innerHTML=previousPage;
        pages.appendChild(prevBtn);
        prevBtn.addEventListener('click',()=>{
            showData(previousPage)
            });
    }

    const curBtn=document.createElement('button')
    curBtn.innerHTML=currentPage;
    pages.appendChild(curBtn);
    curBtn.addEventListener('click',()=>{
        showData(currentPage)
        });
    

    if (hasNextPage){
        const nexBtn=document.createElement('button')
        nexBtn.innerHTML=nextPage;
        pages.appendChild(nexBtn);
        nexBtn.addEventListener('click',()=>{
            showData(nextPage)
            });
    }
}

window.addEventListener("DOMContentLoaded",()=>{
    const page=1;
    showData(page)
});


function errNotify(err){
    const notify=document.getElementById('notify');
    const notification=document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML=`<h4>Request Failed with ${err}</h4>`;
    notify.appendChild(notification);
    setTimeout(()=>{
        notification.remove()
    },2500);   
}