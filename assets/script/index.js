
window.addEventListener('load', function(){
    
  AddCards();  
  slideContainerOnSwipe(this.document.querySelector('.content'));
  categoryReponse();

});

function searchShop(){
  CloseSearch();
}

function BuyNowClick(){
  window.location.href='./catalogue.html'
}

function slideContainerOnSwipe(container) {
  var startX = 0;
  var isSwiping = false;

  container.addEventListener("mousedown", startSwipe);
  container.addEventListener("touchstart", startSwipe);

  container.addEventListener("mousemove", performSwipe);
  container.addEventListener("touchmove", performSwipe);

  container.addEventListener("mouseup", endSwipe);
  container.addEventListener("mouseleave", endSwipe);
  container.addEventListener("touchend", endSwipe);

  function startSwipe(event) {
    isSwiping = true;
    startX = getEventX(event);
  }

  function performSwipe(event) {
    if (!isSwiping) return;
    event.preventDefault();
    var currentX = getEventX(event);
    var distance = startX - currentX;
    container.scrollLeft += distance;
    startX = currentX;
  }

  function endSwipe() {
    isSwiping = false;
  }

  function getEventX(event) {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].clientX; // Touch event
    } else {
      return event.clientX; // Mouse event
    }
  }
}

function categoryReponse(){
  const categoryBoxes= document.querySelectorAll('.cat-box');
   var z;
   for(z=0;z<categoryBoxes.length;z++){
      const box = categoryBoxes[z];
      box.addEventListener('click', function(){
      var j=0;
      for(j;j<categoryBoxes.length;j++){
        categoryBoxes[j].classList.remove('cat-box-active');
      }
      box.classList.add('cat-box-active');

      if(box.textContent=='All')AddCards();
      else sortCard(box.textContent);

    });
   }

}

function AddCards(){
    const cartNum = document.querySelector('.badge');
    cartNum.textContent= this.localStorage.getItem('numItems')?this.localStorage.getItem('numItems'): 0;

    let cartData = localStorage.getItem('cart');
    let cartItems = cartData ? JSON.parse(cartData) : [];
    let whitelistData = localStorage.getItem('whitelist');
    let WhitelistItems = whitelistData ? JSON.parse(whitelistData) : [];
    if (!Array.isArray(cartItems)) {
        cartItems = [];
    }

    if (!Array.isArray(WhitelistItems)) {
      WhitelistItems = [];
    }

    fetch('../../data.json')
  .then(response => response.json())
  .then(data => {
    const productTemplate = document.querySelectorAll('.product')[0];
    const productListContainer = document.querySelector('.product-container');

    productListContainer.innerHTML='';
    productListContainer.appendChild(productTemplate)
    // Loop through each product in the JSON data
      var z;
      for(z=0;z<8;z++){
        product=data[z]
      // Clone the product template
      const productClone = productTemplate.cloneNode(true);

      const DetailButton = productClone.querySelector('.view');
      const ProdCart = productClone.querySelector('.cart');
      const ProdWhiteList = productClone.querySelector('.whitelist');

      // Modify the content of the product clone with product details

        
      productClone.querySelector('.product-image').src = product.images[0];
      productClone.querySelector('.description').textContent = product.brand;
      productClone.querySelector('.name').textContent = product.name;
      productClone.querySelector('.price').textContent = product.price.toFixed(2);
      var i=0;
      var j=0;
      var halfStar=0;
      const stars= productClone.getElementsByClassName('star');
      for(j=0;j<stars.length;j++){
        for(i=0;i<Math.floor(product.rating);i++){
          stars[i].classList.add('bxs-star');
          j++;
        }
        if((product.rating - Math.floor(product.rating))>0 && halfStar==0){
          stars[j].classList.add('bxs-star-half');
          halfStar=1;
        }
      }
      const id=product.id;

      DetailButton.addEventListener('click', function(){
        localStorage.setItem('product', id);
        window.location.href="../../product_detail.html";
      })

      ProdCart.addEventListener('click', function(){
        if(ProdCart.classList.contains('active-parameter')){
            ProdCart.classList.remove('active-parameter');
            cartItems.splice(cartItems.indexOf(id),1);
            //console.log(cartItems);
        }

        else{  
            ProdCart.classList.add('active-parameter');
            cartItems.push(id);
            //console.log(cartItems);
        }
        let numItems = cartItems.length;

      // Store the updated cart data back in localStorage
       localStorage.setItem('cart', JSON.stringify(cartItems));
       localStorage.setItem('numItems', numItems);
        cartNum.textContent = numItems;

       // console.log(localStorage.getItem('cart'));
        //console.log(localStorage.getItem('numItems'));

      });

      ProdWhiteList.addEventListener('click', function(){
        if(ProdWhiteList.classList.contains('active-parameter')){
            ProdWhiteList.classList.remove('active-parameter');
            WhitelistItems.splice(cartItems.indexOf(id),1);
        }

        else{
            ProdWhiteList.classList.add('active-parameter');
            WhitelistItems.push(id);
        }

        localStorage.setItem('whitelist', JSON.stringify(WhitelistItems));

      })

      //update active cart
      var item

  for(item=0;item<cartItems.length;item++){
    if(id==cartItems[item]){
        ProdCart.classList.add('active-parameter');
    }
  }

  for(item=0;item<WhitelistItems.length;item++){
    if(id==WhitelistItems[item]){
        ProdWhiteList.classList.add('active-parameter');
    }
  }

      // Append the product clone to the product list container
      productListContainer.appendChild(productClone);
    }
   
  })
  .catch(error => {
    console.log('Error fetching JSON file:', error);
  });

}

function sortCard(SortText){
  const cartNum = document.querySelector('.badge');
  cartNum.textContent= this.localStorage.getItem('numItems')?this.localStorage.getItem('numItems'): 0;

  let cartData = localStorage.getItem('cart');
  let cartItems = cartData ? JSON.parse(cartData) : [];
  let whitelistData = localStorage.getItem('whitelist');
  let WhitelistItems = whitelistData ? JSON.parse(whitelistData) : [];
  if (!Array.isArray(cartItems)) {
      cartItems = [];
  }

  if (!Array.isArray(WhitelistItems)) {
    WhitelistItems = [];
}
    fetch('../../data.json')
  .then(response => response.json())
  .then(data => {
    const productListContainer = document.querySelector('.product-container');
    const productTemplate = document.querySelectorAll('.product')[0];

    productListContainer.innerHTML='';
    productListContainer.appendChild(productTemplate);
    // Loop through each product in the JSON data
      data.forEach(product => {
        if(product.category==SortText || product.brand==SortText){
           // Clone the product template
      const productClone = productTemplate.cloneNode(true);

      const DetailButton = productClone.querySelector('.view');
      const ProdCart = productClone.querySelector('.cart');
      const ProdWhiteList = productClone.querySelector('.whitelist');

      // Modify the content of the product clone with product details
        
      productClone.querySelector('.product-image').src = product.images[0];
      productClone.querySelector('.description').textContent = product.brand;
      productClone.querySelector('.name').textContent = product.name;
      productClone.querySelector('.price').textContent = product.price.toFixed(2);
      var i=0;
      var t=0;
      var halfStar=0;
      const stars= productClone.getElementsByClassName('star');
      while(t<stars.length){
        for(i=0;i<Math.floor(product.rating);i++){
          stars[i].classList.add('bxs-star');
          t=t+1;
        }
        if((product.rating - Math.floor(product.rating))>0 && halfStar==0){
          stars[t].classList.add('bxs-star-half');
          halfStar=1;
        }  
      }
      const id=product.id;

      DetailButton.addEventListener('click', function(){
        localStorage.setItem('product', id);
        window.location.href="../../product_detail.html";
      })

      ProdCart.addEventListener('click', function(){
        if(ProdCart.classList.contains('active-parameter')){
            ProdCart.classList.remove('active-parameter');
            cartItems.splice(cartItems.indexOf(id),1);
            console.log(cartItems);
        }

        else{
            cartNum.textContent= parseInt(cartNum.textContent, 10)+1;
            ProdCart.classList.add('active-parameter');
            cartItems.push(id);
            console.log(cartItems);
        }
        let numItems = cartItems.length;

      // Store the updated cart data back in localStorage
       localStorage.setItem('cart', JSON.stringify(cartItems));
       localStorage.setItem('numItems', numItems);
        cartNum.textContent = numItems;

        console.log(localStorage.getItem('cart'));
        console.log(localStorage.getItem('numItems'));

      });

      ProdWhiteList.addEventListener('click', function(){
        if(ProdWhiteList.classList.contains('active-parameter')){
            ProdWhiteList.classList.remove('active-parameter');
        }

        else{
            ProdWhiteList.classList.add('active-parameter');
        }
      })

      //update active cart
      var item

      for(item=0;item<cartItems.length;item++){
        if(id==cartItems[item]){
            ProdCart.classList.add('active-parameter');
        }
      }
    
      for(item=0;item<WhitelistItems.length;item++){
        if(id==WhitelistItems[item]){
            ProdWhiteList.classList.add('active-parameter');
        }
      }
      // Append the product clone to the product list container
      productListContainer.appendChild(productClone);

        }
      });
    })
  .catch(error => {
    console.log('Error fetching JSON file:', error);
  });

}