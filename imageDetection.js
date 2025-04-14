import { config } from "./config.js";

export async function detectIngredientsFromImage(imageFiles) {
  try {
    // If using Google Cloud Vision API
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${config.GOOGLE_CLOUD_API_KEY}`;

    // Load COCO-SSD model
    const model = await cocoSsd.load();

    let allFoodItems = new Set();

    for (const file of imageFiles) {
      // Create image element
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Detect objects in the image
      const predictions = await model.detect(img);

      // Filter for food items and common ingredients
      const foodItems = predictions
        .filter((prediction) => isFoodItem(prediction.class))
        .map((prediction) => prediction.class);

      foodItems.forEach((item) => allFoodItems.add(item));
    }

    return Array.from(allFoodItems);
  } catch (error) {
    console.error("Error detecting ingredients:", error);
    throw error;
  }
}

function isFoodItem(className) {
  // List of COCO-SSD classes that represent food items
  const foodClasses = [
    "apple",
    "orange",
    "banana",
    "carrot",
    "broccoli",
    "sandwich",
    "pizza",
    "donut",
    "cake",
    // Add more food classes as needed
  ];

  return foodClasses.includes(className.toLowerCase());
}
