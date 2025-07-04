// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const paginationContainer = document.getElementById('pagination-container');
    const modal = document.getElementById('productModal');

    let currentPage = 1;
    const productsPerPage = 9;
    let filteredProducts = [...products];

    // Function to create a single product card
    function createProductCard(product) {
        return `
            <div class="product-card" onclick="openModal(${product.id})">
                <div class="product-image">
                    <h3 class="product-title">${product.title}</h3>
                    ${product.icon}
                </div>
                <div class="product-content">
                    <p class="product-description">${product.description}</p>
                    <div class="product-pricing">
                        <span class="product-price">${product.price}</span>
                        <span class="product-price-compare">${product.comparePrice}</span>
                        <span class="product-discount">${product.discount}</span>
                    </div>
                    <ul class="product-features">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Function to display products for the current page
    function displayProducts() {
        productsGrid.innerHTML = '';
        noResults.style.display = 'none';

        if (filteredProducts.length === 0) {
            noResults.style.display = 'block';
            paginationContainer.innerHTML = '';
            return;
        }

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        productsGrid.innerHTML = paginatedProducts.map(createProductCard).join('');
        setupPagination();
    }

    // Function to set up pagination buttons with 5-page window
    function setupPagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

        if (pageCount <= 1) return;

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo; Prev';
        prevButton.classList.add('pagination-button');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Calculate the range of page numbers to show (5 pages max)
        const maxVisiblePages = 5;
        let startPage, endPage;

        if (pageCount <= maxVisiblePages) {
            // Show all pages if total pages <= 5
            startPage = 1;
            endPage = pageCount;
        } else {
            // Calculate sliding window
            const halfWindow = Math.floor(maxVisiblePages / 2);
            
            if (currentPage <= halfWindow) {
                // Near the beginning
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage >= pageCount - halfWindow) {
                // Near the end
                startPage = pageCount - maxVisiblePages + 1;
                endPage = pageCount;
            } else {
                // In the middle
                startPage = currentPage - halfWindow;
                endPage = currentPage + halfWindow;
            }
        }

        // Add ellipsis before if needed
        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.innerText = '1';
            firstPageButton.classList.add('pagination-button');
            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                displayProducts();
            });
            paginationContainer.appendChild(firstPageButton);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.innerHTML = '...';
                ellipsis.classList.add('pagination-ellipsis');
                paginationContainer.appendChild(ellipsis);
            }
        }

        // Page Number Buttons (sliding window)
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.classList.add('pagination-button');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayProducts();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Add ellipsis after if needed
        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.innerHTML = '...';
                ellipsis.classList.add('pagination-ellipsis');
                paginationContainer.appendChild(ellipsis);
            }

            const lastPageButton = document.createElement('button');
            lastPageButton.innerText = pageCount;
            lastPageButton.classList.add('pagination-button');
            lastPageButton.addEventListener('click', () => {
                currentPage = pageCount;
                displayProducts();
            });
            paginationContainer.appendChild(lastPageButton);
        }

        // Next Button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next &raquo;';
        nextButton.classList.add('pagination-button');
        nextButton.disabled = currentPage === pageCount;
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                displayProducts();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Function to filter products based on search term
    function filterProducts(searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.features.some(feature => feature.toLowerCase().includes(term))
        );
        currentPage = 1; // Reset to first page after search
        displayProducts();
    }

    // Event listener for the search bar
    searchInput.addEventListener('input', function(e) {
        filterProducts(e.target.value);
    });

    // Modal Functions (global scope for inline onclick)
    window.openModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('modalImage').innerHTML = `
            <h2 class="modal-title">${product.title}</h2>
            ${product.icon}
        `;
        document.getElementById('modalPrice').textContent = product.price;
        document.getElementById('modalComparePrice').textContent = product.comparePrice;
        document.getElementById('modalDiscount').textContent = product.discount;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalFeatures').innerHTML =
            product.features.map(feature => `<li>${feature}</li>`).join('');
        document.getElementById('modalBuyButton').href = product.buyLink;
        modal.style.display = 'block';
    }

    window.closeModal = () => {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside or pressing Escape
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // Initial page load
    displayProducts();
});