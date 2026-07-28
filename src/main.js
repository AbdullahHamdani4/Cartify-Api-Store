import "./style.css";

const body=document.querySelector("body")
const productGrid = document.getElementById("productGrid");
const productModal = document.getElementById("productModal");
const searchInput = document.getElementById("searchInput");
let products=JSON.parse(localStorage.getItem("products"))|| []
const showModal = (id) => {
  let product=products.find(each => each.id ===id);
  productModal.classList.remove("hidden");
  productModal.innerHTML = ` <div class="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">

      <!-- Close button -->
      <button id="closeModalBtn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 z-10" onclick=closeModal(this)>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div class="grid md:grid-cols-2 gap-0">

        <!-- Big image -->
        <div class="bg-gray-100 flex items-center justify-center p-8 md:rounded-l-xl">
          <img id="modalImage" src="${product.images[0]}" alt="Product" class="max-h-80 w-auto object-contain">
        </div>

        <!-- Details -->
        <div class="p-6">
          <p id="modalCategory" class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Beauty</p>
          <h2 id="modalTitle" class="text-2xl font-bold text-gray-900 mt-1">${product.title}</h2>
          <!-- Rating -->
          <div class="flex items-center gap-1 mt-3">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.64 11.545 1 7.91l6.061-.882L10 1.5l2.939 5.528 6.061.882-4.64 3.635 1.518 6.545z"/></svg>
            <span id="modalRating" class="text-sm font-medium text-gray-800">${product.rating}</span>
            <span class="text-sm text-gray-400">(rating)</span>
          </div>

          <!-- Price -->
          <div class="flex items-center gap-3 mt-4">
            <span id="modalPrice" class="text-2xl font-bold text-gray-900">$${product.price}</span>
            <span id="modalDiscount" class="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">-${product.discountPercentage} off</span>
          </div>

          <!-- Description -->
          <p id="modalDescription" class="text-sm text-gray-600 leading-relaxed mt-4">
            ${product.description}
          </p>

          <!-- Extra dummyjson fields -->
          <div class="grid grid-cols-2 gap-3 mt-5 text-sm border-t border-gray-100 pt-4">
            <div>
              <p class="text-gray-400">Stock</p>
              <p id="modalStock" class="font-medium text-gray-800">${product.stock} units</p>
            </div>
            <div>
              <p class="text-gray-400">SKU</p>
              <p id="modalSku" class="font-medium text-gray-800">${product.sku}</p>
            </div>
            <div>
              <p class="text-gray-400">Warranty</p>
              <p id="modalWarranty" class="font-medium text-gray-800">1 month warranty</p>
            </div>
            <div>
              <p class="text-gray-400">Shipping</p>
              <p id="modalShipping" class="font-medium text-gray-800">${product.warrantyInformation}</p>
            </div>
          </div>

        </div>
      </div>
    </div>`
    body.style.overflowY="hidden"
  }

function closeModal(element) {
  element.parentElement.parentElement.classList.add("hidden");
      body.style.overflowY="visible"
};

function createProductCart(each) {
  return `
     <div class="product-card group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow" data-id="1">

        <!-- Discount badge -->
        <span class="absolute top-2 left-2 bg-green-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full z-10">
          ${each.discountPercentage}%
        </span>

        <div class="aspect-square bg-gray-100 overflow-hidden">
          <img src="${each.images[0]}"
               alt="Product image"
               class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform">
        </div>

        <div class="p-3 sm:p-4">
          <p class="text-sm font-medium text-gray-900 truncate">${each.title}</p>
          <div class="flex items-center justify-between mt-1.5">
            <span class="text-base font-bold text-gray-900">$${each.price}</span>
           </div>
          <button
            class="read-more-btn mt-3 w-full text-sm font-medium border border-gray-900 text-gray-900 rounded-md py-1.5 hover:bg-gray-900 hover:text-white transition-colors"
            data-id="1" onclick='showModal(${each.id})'>
            Read more
          </button>
        </div>
      </div>
     `
}
window.showModal = showModal
window.closeModal = closeModal
const apiData = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products?skip=50");
    const data = await response.json();
    const productsFromApiResponse = data.products;
    localStorage.setItem("products", JSON.stringify(productsFromApiResponse));
    products=JSON.parse(localStorage.getItem("products"));
    let mapProducts = products.map((each) => {
      return createProductCart(each)
    });
    productGrid.innerHTML = mapProducts.join("");

  } catch (error) {
    console.log(error);
  }
};
const searchHandler = (valueFromSeachBar) => {
   if (valueFromSeachBar === "") {
    productGrid.innerHTML = (products.map(each => createProductCart(each))).join("")
  }
  else {
    let filterProducts = products.filter((each) => {
      if (each.title.toLowerCase().trim().includes(valueFromSeachBar.toLowerCase())) return each
    }).map((each) => {
      return createProductCart(each)
    });
    if(filterProducts.length===0) productGrid.innerHTML="No Products Found..."
    else productGrid.innerHTML = filterProducts.join("");
  }
};

apiData()

searchInput.addEventListener("input", () => {
  searchHandler(searchInput.value.trim())
})