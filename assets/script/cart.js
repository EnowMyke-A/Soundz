
function ClearCart(){
  localStorage.removeItem('cart');
  localStorage.removeItem('numItems');
  localStorage.removeItem('coupon');
  ShowEmptyCart();
}

function bankOption(){
    const paymentMethodRadios = document.getElementsByName("payment-method");
    const bankCardDetails = document.getElementById("bank-card-details");
    const bankCards = document.getElementsByClassName("card-info")[0];
    const paypal = document.getElementsByClassName("paypal-info")[0];

    for (let i = 0; i < paymentMethodRadios.length; i++) {
      paymentMethodRadios[i].addEventListener("change", function() {
        if (paymentMethodRadios[i].value === "bank-card") {
          bankCardDetails.style.visibility='visible';
          bankCards.style.display='block';
        } else {
            bankCardDetails.style.visibility='hidden';
            bankCards.style.display='none';
        }

        if(paymentMethodRadios[i].value === "paypal")paypal.style.display='block';
        else{paypal.style.display='none'}

        window.scrollTo({
            top: document.body.scrollHeight,
          });
      });
    }  
 }

 function RemoveSkeleton(){
    document.getElementsByClassName('skeleton-container')[0].classList.add('hide-div');
    document.getElementsByClassName('cart-body')[0].classList.remove('hide-div');
  }

  function ShowEmptyCart(){
    let cartItems = JSON.parse(localStorage.getItem('cart'));
    if (!Array.isArray(cartItems)) {
      cartItems = [];
  }
  if(cartItems.length==0 ){
    document.querySelector('.No-item').classList.remove('hide-div');
    document.querySelector('.cart-body').classList.add('hide-div');
  } 
  else{
    document.querySelector('.No-item').classList.add('hide-div');
    document.querySelector('.cart-body').classList.remove('hide-div');
  }  
  }

  function handleCoupon(){
    const couponInput = document.querySelector('.coupon-input');
    if(couponInput.value=='#sOundz1C'){
      localStorage.setItem('coupon', 1);
      window.location.reload()
      return;
    }
    couponInput.value='';
    couponInput.placeholder = 'Invalid Code'
    couponInput.classList.add('invalid')
    localStorage.setItem('coupon', 0);
  }

  function SetUpLoad(){

    var Subtotal=0;
    var Shipping=0;
    var coupon=0;

    const subContainer=document.querySelector('#Subtotal');
    const ShippingContainer=document.querySelector('#shipping');
    const CouponContainer=document.querySelector('#coupon');
    const ApplyCoupon = document.querySelector('#coupon-button');
    const couponInput = document.querySelector('.coupon-input');
    let Applied=localStorage.getItem('coupon') ? localStorage.getItem('coupon') : 0;
    const couponDiscount = Applied? 0.20 : 0;

    ApplyCoupon.disabled = Applied == 1;
    
    let CartContainer= localStorage.getItem('cart');
    let CartItems= CartContainer?JSON.parse(CartContainer):[];
    if (!Array.isArray(CartItems)) {
      CartItems = [];
  }
    const MainCartContainer = document.querySelectorAll('.cart-summary')[1];
    const cartItem= document.querySelectorAll('.cart-item')[3];
    
    var i;
    fetch('../../data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      for(i=0;i<CartItems.length;i++){
        if(CartItems[i]==item.id)
        {
          const cartClone = cartItem.cloneNode(true);
          const add = cartClone.querySelector('.add');
          const reduce = cartClone.querySelector('.reduce');
          const quantityElement = cartClone.querySelector('.cart-quantity');
          const removeItem = cartClone.querySelector('.remove-item');

          const itemPrice= item.price;

          add.addEventListener('click', function() {
            var currentQuantity = parseInt(quantityElement.textContent, 10);
            if(currentQuantity<item.quantity){currentQuantity++;
            quantityElement.textContent = currentQuantity.toString();
            cartClone.querySelector('.price').textContent = (item.price*(parseInt(quantityElement.textContent,10))).toFixed(2);
            Subtotal = Subtotal + itemPrice;
            coupon=coupon+ couponDiscount*itemPrice;
            CouponContainer.textContent=coupon.toFixed(2)
            subContainer.textContent=Subtotal.toFixed(2);
            document.querySelector('#total').textContent=(Shipping+Subtotal-coupon).toFixed(2);
            document.querySelector('.total-price').textContent='$'+ document.querySelector('#total').textContent;
            }
          });

          reduce.addEventListener('click', function() {
            var currentQuantity = parseInt(quantityElement.textContent, 10);
            if (currentQuantity > 1) {
              currentQuantity--;
              quantityElement.textContent = currentQuantity.toString();
            cartClone.querySelector('.price').textContent = (item.price*currentQuantity).toFixed(2);
            Subtotal = Subtotal - itemPrice;
            coupon=coupon-couponDiscount*itemPrice;
            subContainer.textContent=Subtotal.toFixed(2);
            CouponContainer.textContent=coupon.toFixed(2)

            document.querySelector('#total').textContent=(Shipping+Subtotal-coupon).toFixed(2);
            document.querySelector('.total-price').textContent='$'+ document.querySelector('#total').textContent;
            }
          });

          const id= item.id;
  
          removeItem.addEventListener('click', function(){
            CartItems.splice(CartItems.indexOf(id), 1);
            localStorage.setItem('cart',JSON.stringify(CartItems));
            localStorage.setItem('numItems',CartItems.length);
            Subtotal = Subtotal - (itemPrice*(parseInt(quantityElement.textContent,10)));
            Shipping = Shipping - 4.99;
            coupon = coupon - (itemPrice*(parseInt(quantityElement.textContent,10)))*couponDiscount;
            subContainer.textContent=Subtotal.toFixed(2);
            ShippingContainer.textContent=Shipping.toFixed(2);
            CouponContainer.textContent=coupon.toFixed(2);
            document.querySelector('#total').textContent=(Shipping+Subtotal-coupon).toFixed(2);
            document.querySelector('.total-price').textContent='$'+ document.querySelector('#total').textContent;
            cartClone.style.display='none';
            ShowEmptyCart();
          })

          cartClone.querySelector('.cart-image').src= item.images[0];
          cartClone.querySelector('.name').textContent= item.name;
          cartClone.querySelector('.price').textContent = (item.price*(parseInt(cartClone.querySelector('.cart-quantity').textContent,10))).toFixed(2);
          Subtotal= Subtotal + item.price;
          coupon = coupon + itemPrice*couponDiscount;
          Shipping = Shipping + 4.99*quantityElement.textContent;
          ShippingContainer.textContent=Shipping.toFixed(2)
          subContainer.textContent=Subtotal.toFixed(2);
          CouponContainer.textContent=coupon.toFixed(2)

          MainCartContainer.appendChild(cartClone);
        }
        document.querySelector('#total').textContent=(Shipping+Subtotal-coupon).toFixed(2);
        document.querySelector('.total-price').textContent='$'+ document.querySelector('#total').textContent;
      }
    });
  });
  }

  function BackToShop(){
    window.location.href='./index.html#captionPoint';
  }



  function addDashes(cardNumber) {
    // Split the card number into an array of digits.
    if(cardNumber.length!=0 && cardNumber.length%4==0){
      
    }
   
  }


  function CardNumValidate(){
    const cardNumber = document.querySelector('#card-number');
    cardNumber.addEventListener("keypress", function(event) {
      if((cardNumber.value.length + 1)%(5)==0 && cardNumber.value.length!=0 && cardNumber.value.length<19){
        cardNumber.value = cardNumber.value + '-';
      }
      if(event.key=='-' || cardNumber.value.length>=19)event.preventDefault();
    });
  
    cardNumber.addEventListener("input",function(){
      value=cardNumber.value;
      var sanitizedValue = value.replace(/[^0-9-]/g, '');
      cardNumber.value = sanitizedValue;
    })
  }

  function CVVvalidate(){
    const cvv = document.querySelector('#cvv');
    cvv.addEventListener("keypress", function(event){
      if(cvv.value.length>=3)event.preventDefault();
    });

    cvv.addEventListener("input", function(){
      value = cvv.value
      var sanitizedValue = value.replace(/[^0-9]/g, '');
      cvv.value = sanitizedValue
    })
  }

  function ExpiryValidate(){
  const expiryInput = document.querySelector('#expiry-date');
  const cvv = document.querySelector('#cvv');
    expiryInput.addEventListener("keypress", function(event){
      if(expiryInput.value.length>=5 || event.key=='/')event.preventDefault();
        if(expiryInput.value.length==2)expiryInput.value = expiryInput.value + '/';  
    });
     expiryInput.addEventListener("input", function(){
      var value= expiryInput.value;
      var sanitizedValue = value.replace(/[^0-9/]/g, '');
      expiryInput.value = sanitizedValue
    })
  }

  function NameValidate(){
    var cardholder = document.querySelector('#cardholder-name');

    cardholder.addEventListener("input", function(){
      var value = cardholder.value;
      var sanitizedValue = value.replace(/[0-9/#?!@&*^)(}{~`;:'"|,.]/g, '');
      cardholder.value = sanitizedValue;
    })
  }

  function PhoneValidate(){
    const phoneInput = document.querySelector('#phone');

    phoneInput.addEventListener("keypress", function(event) {
      if(phoneInput.value.length>=20)event.preventDefault();
    });

phoneInput.addEventListener("input", function() {
  const inputValue = this.value;
  const formattedValue = formatPhoneNumber(inputValue);
  this.value = formattedValue;
});

  function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters from the input
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  // Apply the desired phone number format
  const formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

  return formattedNumber;
}
  }

  function InputCheckFunctions(){
    CardNumValidate();
    CVVvalidate();
    ExpiryValidate();
    NameValidate();
    PhoneValidate();
  }
  

 window.addEventListener('load', function(){
    bankOption();
    SetUpLoad();
    RemoveSkeleton();
    ShowEmptyCart();
    InputCheckFunctions();
 })