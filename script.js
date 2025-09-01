// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Back to Top button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Filter functionality for school search
    const schoolSearch = document.getElementById('schoolSearch');
    if (schoolSearch) {
        schoolSearch.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            const schoolCards = document.querySelectorAll('.school-card');
            
            schoolCards.forEach(card => {
                const schoolName = card.querySelector('h5').textContent.toLowerCase();
                if (schoolName.includes(searchValue)) {
                    card.parentElement.style.display = 'block';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    }

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const school = document.getElementById('school').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            console.log({name, email, school, message});
            
            // Show success message (in a real app, this would happen after successful submission)
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }

    // Product hover effect
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.product-image img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.product-image img').style.transform = 'scale(1)';
        });
    });

    // Dynamic header size on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });

    // Animated counter for statistics
    const counters = document.querySelectorAll('.counter-value');
    let hasAnimated = false;

    function checkIfInView() {
        if (counters.length && !hasAnimated) {
            const statsSection = document.querySelector('#stats');
            if (!statsSection) return;
            
            const windowHeight = window.innerHeight;
            const sectionTop = statsSection.getBoundingClientRect().top;
            
            if (sectionTop < windowHeight * 0.75 && sectionTop > -windowHeight * 0.25) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target, 2000);
                });
            }
        }
    }

    function animateCounter(element, target, duration) {
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        
        const timer = setInterval(() => {
            start += step;
            element.textContent = start.toLocaleString();
            
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            }
        }, 16);
    }

    window.addEventListener('scroll', checkIfInView);
    checkIfInView(); // Check on page load

    // Image gallery for product details
    const productThumbs = document.querySelectorAll('.product-thumb');
    if (productThumbs.length) {
        productThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const mainImage = document.querySelector('.product-main-image');
                mainImage.src = this.getAttribute('data-image');
                
                productThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Size selection functionality
    const sizeButtons = document.querySelectorAll('.size-btn');
    if (sizeButtons.length) {
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                sizeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const selectedSize = this.getAttribute('data-size');
                document.querySelector('#selectedSize').value = selectedSize;
            });
        });
    }

    // Shopping cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productId = this.getAttribute('data-product-id');
                const productName = this.getAttribute('data-product-name');
                const productPrice = this.getAttribute('data-product-price');
                const productImage = this.getAttribute('data-product-image');
                
                addToCart({id: productId, name: productName, price: productPrice, image: productImage, quantity: 1});
                
                // Show notification
                showNotification(`${productName} added to cart!`);
                
                // Update cart counter
                updateCartCounter();
            });
        });
    }

    // Cart functions
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex !== -1) {
            // Product already in cart, increase quantity
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        if (!cartCounter) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCounter.textContent = itemCount;
        
        if (itemCount > 0) {
            cartCounter.classList.add('has-items');
        } else {
            cartCounter.classList.remove('has-items');
        }
    }

    // Initialize cart counter on page load
    updateCartCounter();

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // School uniform filter by gender
    const genderFilters = document.querySelectorAll('.gender-filter');
    if (genderFilters.length) {
        genderFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const gender = this.getAttribute('data-gender');
                
                genderFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                const uniformItems = document.querySelectorAll('.uniform-item');
                
                uniformItems.forEach(item => {
                    if (gender === 'all' || item.getAttribute('data-gender') === gender) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email && validateEmail(email)) {
                // In a real app, you would send this to a server
                console.log(`Subscribing email: ${email}`);
                
                // Show success message
                showNotification('Thanks for subscribing to our newsletter!');
                
                // Clear form
                emailInput.value = '';
            } else {
                // Show error
                showNotification('Please enter a valid email address');
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.navbar-toggler');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                navbarToggler.click();
            }
        }
    });

    // Load more products functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const hiddenProducts = document.querySelectorAll('.product-card.hidden');
            const productsToShow = Array.from(hiddenProducts).slice(0, 4);
            
            productsToShow.forEach(product => {
                product.classList.remove('hidden');
                // Trigger AOS animation
                product.setAttribute('data-aos', 'fade-up');
                AOS.refresh();
            });
            
            // Hide button if no more products to show
            if (document.querySelectorAll('.product-card.hidden').length === 0) {
                this.style.display = 'none';
            }
        });
    }
});
