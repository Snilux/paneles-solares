// Import Lucide icons library
lucide.createIcons();

// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Initialize all functionality
  initNavigation();
  // initContactForm();
});

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  let isMenuOpen = false;

  // Handle scroll effect on navbar
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-slate-900/95", "backdrop-blur-md", "shadow-lg");
      navbar.classList.remove("bg-transparent");
    } else {
      navbar.classList.remove(
        "bg-slate-900/95",
        "backdrop-blur-md",
        "shadow-lg"
      );
      navbar.classList.add("bg-transparent");
    }
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.remove("hidden");
      mobileMenuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    } else {
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    }
    lucide.createIcons();
  });

  // Close mobile menu when clicking nav links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      isMenuOpen = false;
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
      lucide.createIcons();
    });
  });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Products functionality
// function initProducts() {
//   const products = [
//     {
//       id: 1,
//       name: "Panel Solar Residencial 300W",
//       price: "$ 8,999.00",
//       image:
//         "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 2,
//       name: "Panel Solar Comercial 450W",
//       price: "$ 12,999.00",
//       image:
//         "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 3,
//       name: "Panel Solar Industrial 600W",
//       price: "$ 15,999.00",
//       image:
//         "https://images.unsplash.com/photo-1466611653911-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 4,
//       name: "Kit Solar Básico 1kW",
//       price: "$ 25,999.00",
//       image:
//         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 5,
//       name: "Panel Solar Premium 350W",
//       price: "$ 10,999.00",
//       image:
//         "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 6,
//       name: "Panel Solar Ultra 500W",
//       price: "$ 14,999.00",
//       image:
//         "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 7,
//       name: "Kit Solar Avanzado 2kW",
//       price: "$ 35,999.00",
//       image:
//         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//     {
//       id: 8,
//       name: "Kit Solar Profesional 3kW",
//       price: "$ 45,999.00",
//       image:
//         "https://images.unsplash.com/photo-1466611653911-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
//       inStock: true,
//     },
//   ];

//   const productsGrid = document.getElementById("products-grid");
//   const showMoreBtn = document.getElementById("show-more-btn");
//   let showAll = false;

//   function renderProducts() {
//     const displayedProducts = showAll ? products : products.slice(0, 4);

//     productsGrid.innerHTML = displayedProducts
//       .map(
//         (product) => `
//             <div class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
//                 ${
//                   product.inStock
//                     ? `
//                     <div class="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
//                         EN STOCK
//                     </div>
//                 `
//                     : ""
//                 }
                
//                 <div class="relative overflow-hidden">
//                     <img src="${product.image}" alt="${
//           product.name
//         }" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300">
//                     <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </div>

//                 <div class="p-6">
//                     <h3 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
//                         ${product.name}
//                     </h3>
//                     <div class="flex items-center justify-between">
//                         <span class="text-2xl font-bold text-blue-600">${
//                           product.price
//                         }</span>
//                         <button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
//                             Ver más
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `
//       )
//       .join("");
//   }

//   showMoreBtn.addEventListener("click", () => {
//     showAll = !showAll;
//     renderProducts();

//     if (showAll) {
//       showMoreBtn.innerHTML =
//         'Ver menos <i data-lucide="chevron-up" class="w-5 h-5"></i>';
//     } else {
//       showMoreBtn.innerHTML =
//         'Ver más productos <i data-lucide="chevron-down" class="w-5 h-5"></i>';
//     }
//     lucide.createIcons();
//   });

//   // Initial render
//   renderProducts();
// }

// Contact form functionality
// function initContactForm() {
//   const contactForm = document.getElementById("contact-form");

//   contactForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     // Get form data
//     const formData = new FormData(contactForm);
//     const data = Object.fromEntries(formData);

//     // Here you would typically send the data to a server
//     console.log("Form submitted:", data);

//     // Show success message (you can customize this)
//     alert("¡Gracias por tu mensaje! Te contactaremos pronto.");

//     // Reset form
//     contactForm.reset();
//   });
// }

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;
