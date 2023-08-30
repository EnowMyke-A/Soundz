function changeNavbarColorOnScroll() {
    if(document.body.scrollTop > 350 || document.documentElement.scrollTop > 350){
    document.getElementsByClassName("prod-nav")[0].style.backgroundColor="var(--white-color)";
	}
	else{
    document.getElementsByClassName("prod-nav")[0].style.backgroundColor="transparent";
	}
  }

  function RemoveSkeleton(){
    document.getElementsByClassName('skeleton-container')[0].classList.add('hide-div');
    document.getElementsByClassName('product-body')[0].classList.remove('hide-div');
  }

  var quantity;
  var id;

  function updateAdd(){
    var CartQuantity= document.querySelector('.cart-quantity').textContent;
    const numberLeft=document.querySelectorAll('.number-left')[1];
    if(parseInt(numberLeft.textContent,10)>0)
    {
      document.querySelector('.cart-quantity').textContent = parseInt(CartQuantity, 10)+1;
      numberLeft.textContent = ( parseInt(numberLeft.textContent,10)-1).toString() + " Left";
    }
  }

  function updateReduce(){
    var CartQuantity= document.querySelector('.cart-quantity').textContent;
    const numberLeft=document.querySelectorAll('.number-left')[1];
    if(parseInt(numberLeft.textContent,10)<quantity){
      document.querySelector('.cart-quantity').textContent= parseInt(CartQuantity, 10)-1;
      numberLeft.textContent = ( parseInt(numberLeft.textContent,10)+ 1).toString() + " Left";
    }
    
  }
  


  // Get DOM elements
const imageContainer = document.getElementsByClassName('slide');
const prevButton = document.getElementsByClassName('product-prev')
const nextButton = document.getElementsByClassName('product-next');
const paginationDots = document.getElementsByClassName('dots')

// Set initial index and total number of images
let currentIndex = 0;
const index=[0, 1, 2, 3];

// Function to update visibility of buttons and pagination dots based on current index
function updateUI() {
  prevButton[1].disabled = currentIndex === 0;
  nextButton[1].disabled = currentIndex === imageContainer.length - 1;

  // Update active pagination dot
  for (let i = 0; i < imageContainer.length; i++) {
    paginationDots[i].classList.toggle('active', i === currentIndex);
    addListenertoDots(i);
  }
}

// Function to handle previous button click
function handlePrevButtonClick() {
  if (currentIndex > 0) {
    currentIndex--;
    updateUI();
    updateImageContainer();
  }
}

// Function to handle next button click
function handleNextButtonClick() {
  if (currentIndex < imageContainer.length - 1) {
    currentIndex++;
    updateUI();
    updateImageContainer();
  }
}

// Function to handle pagination dot click
function handlePaginationClick(index) {
  currentIndex = index;
  updateUI();
  updateImageContainer();
}

// Function to update the image container position
function updateImageContainer() {
    for(i=0;i<imageContainer.length;i++){
        imageContainer[i].style.transform = `translateX(-${currentIndex * 100}%)`;
    } 
}

function addListenertoDots(i){
        paginationDots[i].addEventListener('click', function(){
         handlePaginationClick(i);
        })
}

function DisableCartBuy(id, ItemLeft){
  const cartButton = document.querySelector('.add-to-cart');
  const BuyButton = document.querySelector('.product-proceed .buy-button');
  let CartList = localStorage.getItem('cart');
  let CartData = CartList? JSON.parse(CartList) : [];
  if(!Array.isArray(CartData)){
    CartData = [];
  }
  var z=0;
  for(z;z<CartData.length;z++){
      cartButton.disabled = CartData[z]==id || ItemLeft==0;
      BuyButton.disabled = CartData[z]==id || ItemLeft==0;
      if(cartButton.disabled) break;
  }
}



function SetupUI(){
  const Pname=document.querySelector('#name');
  const Pleft=document.querySelectorAll('.number-left');
  const PCategory=document.querySelector('#category');
  const Prate=document.querySelectorAll('.rate-value');
  const Pprice=document.querySelector('.price');
  const Pimage=document.querySelectorAll('.large-image');
  const reviewNum=document.querySelector('.people');
  const rateBars=document.querySelectorAll('.fill');
  const pdtDetails=document.querySelectorAll('.actual-detail');
  const reviewMessage=document.querySelectorAll('.review-messages')[1];
  const PersonalRev= document.querySelectorAll('.personal-review')[2];
  const colorRadio = document.querySelectorAll('.color-radioset')[1];
  colorRadio.innerHTML="";
   fetch('../../data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      if(item.id==localStorage.getItem('product')){
        id=item.id;
        Pname.textContent=item.name
        PCategory.textContent= item.brand +' - '+item.category;
        Pprice.textContent=item.price;
        Prate[0].textContent=item.rating;
        Prate[1].textContent=item.rating;
        Pleft[1].textContent=item.quantity-1 +' Left';
        pdtDetails[1].textContent=item.description;
        quantity=item.quantity-1;
        var i;
        for(i=0;i<Pimage.length;i++){
          Pimage[i].src=item.images[i]
        }
      var i=0;
      var j=0;
      var halfStar=0;
      const stars= document.getElementsByClassName('star');
      for(j=0;j<stars.length;j++){
        for(i=0;i<Math.floor(item.rating);i++){
          stars[i].classList.add('bxs-star');
          j++;
        }
        if((item.rating - Math.floor(item.rating))>0 && halfStar==0){
          stars[j].classList.add('bxs-star-half');
          halfStar=1;
        }
      }

      //Disable Cart button or buy if already on cart
      DisableCartBuy(id);

        // Indicate whitelist
      const whitelistIcon = document.querySelector('.whitelist-indicator');
      var items = 0;
      var whiteListData=localStorage.getItem('whitelist');
      var whiteListItem = JSON.parse(whiteListData);
      if(!Array.isArray(whiteListItem)){
        whiteListItem=[];
      }
      
      for(items;items<whiteListItem.length;items++){
          if(item.id==whiteListItem[items]){
          whitelistIcon.classList.add('active-whitelist')
        }
      }

      //Product Colors
      const itemColor = item.colors
      for(items=0;items<itemColor.length;items++){
        var radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "color";
        radioButton.value = itemColor[items];
        radioButton.classList.add('available-color');
        radioButton.style.backgroundColor=itemColor[items];
        if (items === 0) {
          radioButton.checked = true;
        }

        colorRadio.appendChild(radioButton);
      }

      const totalRev=item['totalRatings']['5']+item['totalRatings']['4']+item['totalRatings']['3']+item['totalRatings']['2']+item['totalRatings']['1'];

      reviewNum.textContent= totalRev+ ' reviews';
      var t
      for(t=0;t<rateBars.length;t++){
        const Fillwidth= (item['totalRatings'][`${t+1}`]/totalRev)*100
        rateBars[4-t].style.width= `${Fillwidth}%`;
        
      }



      //Display review
      for(t=0;t<2;t++){
        
        const ReviewClone = PersonalRev.cloneNode(true);
        ReviewClone.querySelector('.reviewer-name').textContent=item.feedback[t].user;
        ReviewClone.querySelector('.reviewer-message').textContent=item.feedback[t].message;
        ReviewClone.querySelector('.time').textContent=item.feedback[t].timeRated;
        ReviewClone.querySelector('.reviewer-img').src=item.feedback[t].image;
        var i=0;
        var j=0;
        var halfStar=0;
        const stars= ReviewClone.querySelectorAll('.star-rev');
        for(j=0;j<stars.length;j++){
        for(i=0;i<Math.floor(item.feedback[t].rating);i++){
          stars[i].classList.add('bxs-star');
          j++;
        }
        if((item.feedback[t].rating - Math.floor(item.feedback[t].rating))>0 && halfStar==0){
          stars[j].classList.add('bxs-star-half');
          halfStar=1;
        }
      }
        reviewMessage.appendChild(ReviewClone);
      }


      } 
    })
    
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

  window.addEventListener('load', function(){
    updateUI();
    updateImageContainer();
    SetupUI();
    RemoveSkeleton();
  })

  window.addEventListener('scroll', function(){
    changeNavbarColorOnScroll();
  })

  function clickWhiteList(){

      const whitelistIcon = document.querySelector('.whitelist-indicator');
      var whiteListData=localStorage.getItem('whitelist');
      var whiteListItem = JSON.parse(whiteListData);
      if(!Array.isArray(whiteListItem)){
        whiteListItem=[];
      }

    if(whitelistIcon.classList.contains('active-whitelist')){
      whitelistIcon.classList.remove('active-whitelist');
      whiteListItem.splice(whiteListItem.indexOf(id),1);
  }

  else{
    whitelistIcon.classList.add('active-whitelist');
      whiteListItem.push(id);
  }

  localStorage.setItem('whitelist', JSON.stringify(whiteListItem));

  }
