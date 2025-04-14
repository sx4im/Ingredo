import { generateRecipe } from "./recipeGenerator.js";
import { detectIngredientsFromImage } from "./imageDetection.js";
import {
  saveRecipe,
  getSavedRecipes,
  initializeStorage,
  deleteRecipe,
} from "./storage.js";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Initialize ScrollReveal
  const sr = ScrollReveal({
    origin: "bottom",
    distance: "20px",
    duration: 1000,
    delay: 200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });

  // Reveal header elements
  sr.reveal("header h1", { origin: "top" });
  sr.reveal("header p", { delay: 400 });

  // Reveal form elements with stagger
  sr.reveal("#recipeForm > *", {
    interval: 200,
    distance: "20px",
    origin: "left",
  });

  // Reveal recipe output
  sr.reveal("#recipeOutput", {
    origin: "right",
    distance: "30px",
    delay: 300,
  });

  // Reveal saved recipes with stagger
  sr.reveal(".recipe-card", {
    interval: 150,
    distance: "20px",
    origin: "bottom",
  });

  // GSAP Animations
  // Parallax effect for background
  gsap.utils.toArray(".parallax-bg").forEach((section) => {
    gsap.to(section, {
      backgroundPosition: `50% ${-50}%`,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Animate stats counter
  gsap.utils.toArray(".stat-number").forEach((stat) => {
    let target = parseFloat(stat.textContent);
    gsap.to(stat, {
      textContent: target,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: stat,
        start: "top 80%",
      },
    });
  });

  // Animate feature icons
  gsap.from(".feature-icon", {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".feature-icon",
      start: "top 80%",
    },
  });

  // Enhanced Mobile Menu Functionality
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuIcon = document.querySelector(".menu-icon");
  const closeIcon = document.querySelector(".close-icon");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

  // Toggle mobile menu
  mobileMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("hidden");
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");

    // Animate menu button
    gsap.to(mobileMenuButton, {
      rotate: mobileMenu.classList.contains("hidden") ? 0 : 90,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target) &&
      !mobileMenu.classList.contains("hidden")
    ) {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");

      // Reset menu button rotation
      gsap.to(mobileMenuButton, {
        rotate: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });

  // Handle mobile menu link clicks
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");

      // Reset menu button rotation
      gsap.to(mobileMenuButton, {
        rotate: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Enhanced smooth scroll for all navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId === "#") {
        // Scroll to top for home link
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        const target = document.querySelector(targetId);
        if (target) {
          // Get the height of the navbar
          const navHeight = document.querySelector("nav").offsetHeight;

          // Calculate the final scroll position
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          // Smooth scroll with GSAP
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: targetPosition,
              autoKill: false,
            },
            ease: "power2.inOut",
          });
        }
      }
    });
  });

  // Add active state to navigation links based on scroll position
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  function updateActiveLink() {
    const navHeight = document.querySelector("nav").offsetHeight;
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.clientHeight;
      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        current = "#" + section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-indigo-600");
      if (link.getAttribute("href") === current) {
        link.classList.add("text-indigo-600");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);

  const recipeForm = document.getElementById("recipeForm");
  const imageUploadInput = document.getElementById("imageUpload");
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  );
  const recipeOutput = document.getElementById("recipeOutput");
  const savedRecipesContainer = document.getElementById("savedRecipes");
  const selectedFiles = new Set();

  // Initialize WebSocket connection
  initializeStorage();

  // Subscribe to saved recipes
  getSavedRecipes((recipes) => {
    updateSavedRecipes(recipes);
  });

  imageUploadInput.addEventListener("change", handleImageUpload);

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);

    if (selectedFiles.size + files.length > 3) {
      alert("You can only upload up to 3 images");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files");
        continue;
      }

      selectedFiles.add(file);
    }

    updateImagePreviews();

    if (selectedFiles.size > 0) {
      showLoading("Analyzing images...");
      try {
        const ingredients = await detectIngredientsFromImage(
          Array.from(selectedFiles)
        );
        const currentIngredients = document.getElementById("ingredients").value;
        const newIngredients = currentIngredients
          ? currentIngredients + ", " + ingredients.join(", ")
          : ingredients.join(", ");
        document.getElementById("ingredients").value = newIngredients;
      } catch (error) {
        showError(
          "Failed to detect ingredients. Please try entering them manually."
        );
        console.error(error);
      }
      hideLoading();
    }
  }

  function updateImagePreviews() {
    imagePreviewContainer.innerHTML = "";

    selectedFiles.forEach((file) => {
      const preview = document.createElement("div");
      preview.className = "relative inline-block mr-2 mb-2";
      preview.innerHTML = `
        <img src="${URL.createObjectURL(file)}" 
             alt="Preview" 
             class="h-24 w-24 object-cover rounded border-2 border-gray-300">
        <button 
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          data-filename="${file.name}"
        >×</button>
      `;

      const deleteButton = preview.querySelector("button");
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        const filename = e.target.dataset.filename;
        for (const file of selectedFiles) {
          if (file.name === filename) {
            selectedFiles.delete(file);
            break;
          }
        }
        updateImagePreviews();
      });

      imagePreviewContainer.appendChild(preview);
    });
  }

  recipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ingredients = document.getElementById("ingredients").value;
    const diet = document.getElementById("diet").value;

    if (!ingredients.trim()) {
      alert("Please enter some ingredients!");
      return;
    }

    const loadingMessage =
      selectedFiles.size > 0 ? "Analyzing images..." : "Generating recipe...";
    showLoading(loadingMessage);

    try {
      const recipe = await generateRecipe(ingredients, diet);
      displayRecipe(recipe);
    } catch (error) {
      showError("Failed to generate recipe. Please try again.");
      console.error(error);
    }
    hideLoading();
    gsap.to(recipeForm, {
      scale: 0.98,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  });

  function updateSavedRecipes(recipes) {
    savedRecipesContainer.innerHTML = "";

    if (recipes.length === 0) {
      savedRecipesContainer.innerHTML = `
        <div class="col-span-3 text-center text-gray-500 py-8">
          No saved recipes yet. Generate a recipe and save it!
        </div>
      `;
      return;
    }

    recipes.forEach((recipe) => {
      const card = createRecipeCard(recipe);
      savedRecipesContainer.appendChild(card);
    });
  }

  function showLoading(message = "Loading...") {
    const defaultMessage = "Generating recipe...";
    const displayMessage = selectedFiles.size > 0 ? message : defaultMessage;

    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "loadingOverlay";
    loadingOverlay.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    loadingOverlay.innerHTML = `
      <div class="bg-white p-4 rounded-lg">
        <div class="loading-spinner"></div>
        <p class="mt-2 text-center">${displayMessage}</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
  }

  function hideLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }

  function showError(message) {
    recipeOutput.innerHTML = `
      <div class="text-red-500 text-center">
        ${message}
      </div>
    `;
  }

  function displayRecipe(recipe) {
    const recipeHtml = `
      <div class="fade-in">
        <h2 class="text-2xl font-bold mb-4">${recipe.title}</h2>
        
        <div class="mb-4">
          <h3 class="font-bold">Ingredients:</h3>
          <ul class="list-disc pl-5">
            ${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
        </div>

        <div class="mb-4">
          <h3 class="font-bold">Instructions:</h3>
          <ol class="list-decimal pl-5">
            ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>

        <div class="flex justify-between items-center mt-4">
          <div>
            <span class="text-gray-600">Cooking Time: ${
              recipe.cookingTime
            }</span>
            <span class="text-gray-600 ml-4">Servings: ${recipe.servings}</span>
          </div>
          ${
            !recipe.id
              ? `
            <button 
              onclick="saveRecipeHandler(${JSON.stringify(recipe).replace(
                /"/g,
                "&quot;"
              )})"
              class="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
            >
              Save Recipe
            </button>
          `
              : ""
          }
        </div>
      </div>
    `;

    recipeOutput.innerHTML = recipeHtml;
  }

  function createRecipeCard(recipe) {
    const div = document.createElement("div");
    div.className = "recipe-card bg-white rounded-lg shadow p-4";
    div.innerHTML = `
      <h3 class="font-bold mb-2">${recipe.title}</h3>
      <p class="text-gray-600 text-sm mb-2">${
        recipe.ingredients.length
      } ingredients</p>
      <p class="text-gray-600 text-sm mb-4">${recipe.cookingTime}</p>
      <div class="flex justify-between items-center">
        <button 
          class="text-indigo-600 hover:text-indigo-800"
          onclick="viewRecipeHandler(${JSON.stringify(recipe).replace(
            /"/g,
            "&quot;"
          )})"
        >
          View Details
        </button>
        <button 
          class="text-red-600 hover:text-red-800"
          onclick="deleteRecipeHandler('${recipe.id}')"
        >
          Delete
        </button>
      </div>
    `;
    return div;
  }

  // Contact Form Handler
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Show success message (in real app, you'd send this to a server)
      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();
    });
  }

  gsap.utils.toArray(".recipe-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Add hover animations for buttons
  gsap.utils.toArray("button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
});

// Global handlers for onclick events
window.saveRecipeHandler = async function (recipe) {
  const success = await saveRecipe(recipe);
  if (!success) {
    alert("Failed to save recipe. Please try again.");
  }
};

window.deleteRecipeHandler = async function (recipeId) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    const success = await deleteRecipe(recipeId);
    if (!success) {
      alert("Failed to delete recipe. Please try again.");
    }
  }
};

window.viewRecipeHandler = function (recipe) {
  const recipeOutput = document.getElementById("recipeOutput");
  displayRecipe(recipe);
  window.scrollTo({ top: recipeOutput.offsetTop, behavior: "smooth" });
};
