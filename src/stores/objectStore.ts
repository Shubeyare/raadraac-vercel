import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { tensorflowService } from "../services/tensorflowService";

export interface SomaliObject {
  id: string;
  nameEn: string;
  nameSo: string;
  material: string;
  traditionalUse: string;
  culturalInsight: string;
  region?: string;
  pronunciation?: string;
  proverb?: string;
  imageUrl?: string;
}

export const useObjectStore = defineStore("object", () => {
  const currentImage = ref<string | null>(null);
  const recognizedObject = ref<SomaliObject | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const debugInfo = ref<string | null>(null);

  // Sample database of Somali objects
  const objectsDatabase = ref<SomaliObject[]>([
    {
      id: "dhiil",
      nameEn: "Milk Container",
      nameSo: "Dhiil",
      material: "Wood (typically from the Qurac tree)",
      traditionalUse: "Used to store camel milk and other dairy products.",
      culturalInsight:
        "The dhiil is essential in nomadic Somali culture, where dairy is a primary food source. The container is designed to keep milk cool in hot climates.",
      region: "Northern Somalia",
      pronunciation: "dhiil",
      proverb:
        "Dhiil waa la qaadaa, hadalna waa la qaadaa (Both a dhiil and a promise are things to be carried).",
    },
    {
      id: "qarsin",
      nameEn: "Water Container",
      nameSo: "Qarsin",
      material: "Woven plant fibers coated with natural resins",
      traditionalUse:
        "Used to store and carry water, especially during travel.",
      culturalInsight:
        "The qarsin demonstrates Somali ingenuity in desert environments. Its woven design allows it to keep water cool through evaporation.",
      region: "Throughout Somalia",
      pronunciation: "qar-sin",
      proverb:
        "Qarsin biyo dhaamin laguma aqbalo (An empty water container is not accepted).",
    },
    {
      id: "masaf",
      nameEn: "Traditional Mat",
      nameSo: "Masaf",
      material: "Palm leaves and natural fibers",
      traditionalUse: "Used for sitting, sleeping, and prayer.",
      culturalInsight:
        "The masaf mat represents Somali craftsmanship and is often made by women. The intricate patterns can indicate regional origin and family traditions.",
      region: "Southern Somalia",
      pronunciation: "ma-saf",
      proverb:
        "Masaf lagu fadhiistay baa lagu seexdaa (The mat you sit on is the one you sleep on).",
    },
  ]);

  // Computed properties
  const hasRecognizedObject = computed(() => recognizedObject.value !== null);

  // Actions
  function setCurrentImage(imageUrl: string) {
    console.log(
      "Setting current image:",
      imageUrl ? imageUrl.substring(0, 50) + "..." : "null"
    );
    currentImage.value = imageUrl;
    recognizedObject.value = null;
    error.value = null;
    debugInfo.value = null;
  }

  async function recognizeObject(confidence = 0.3) {
    console.log("Starting image recognition with threshold:", confidence);
    if (!currentImage.value) {
      console.error("No image available for recognition");
      error.value = "No image available for recognition";
      return;
    }

    isLoading.value = true;
    error.value = null;
    debugInfo.value = null;

    try {
      // Create an image element from the data URL
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow cross-origin images
      
      // Set up image loading handlers
      await new Promise((resolve, reject) => {
        img.onload = () => {
          console.log("Image loaded successfully, size:", img.width, "x", img.height);
          resolve(true);
        };
        img.onerror = (e) => {
          console.error("Error loading image:", e);
          reject(new Error("Failed to load image"));
        };
        img.src = currentImage.value!;
      });

      // Extra check that image dimensions are valid
      if (img.width === 0 || img.height === 0) {
        throw new Error(`Invalid image dimensions: ${img.width}x${img.height}`);
      }

      // Use TensorFlow.js model to make predictions
      console.log("Sending image to TensorFlow service");
      const predictions = await tensorflowService.predict(img);

      // Store debug info
      debugInfo.value = `Predictions: ${JSON.stringify(predictions, null, 2)}`;
      console.log("Prediction results:", predictions);

      // Log all predictions for debugging
      for (const pred of predictions) {
        console.log(`Class: ${pred.className}, Confidence: ${(pred.probability * 100).toFixed(1)}%`);
      }

      // Check if the top prediction is "dhiil" with high confidence
      if (
        predictions.length > 0 && 
        predictions[0].className === "dhiil" &&
        predictions[0].probability > confidence
      ) {
        console.log(
          "Recognized as dhiil with confidence:",
          predictions[0].probability
        );

        // Find the dhiil object in our database
        recognizedObject.value =
          objectsDatabase.value.find((obj) => obj.id === "dhiil") || null;
        console.log(
          "Found object in database:",
          recognizedObject.value ? "yes" : "no"
        );
      } else {
        // Object not recognized with high enough confidence
        const topPrediction = predictions.length > 0 ? predictions[0] : { className: "unknown", probability: 0 };
        
        console.log(
          "Not recognized as dhiil. Top prediction:",
          topPrediction.className,
          "with confidence:",
          topPrediction.probability
        );
        
        error.value = `Object not recognized as dhiil (${topPrediction.className}: ${(topPrediction.probability * 100).toFixed(1)}%). Please try another image.`;
        recognizedObject.value = null;
      }
    } catch (e) {
      console.error("Recognition error:", e);
      error.value =
        e instanceof Error ? e.message : "An unknown error occurred";
      recognizedObject.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  function clearRecognition() {
    currentImage.value = null;
    recognizedObject.value = null;
    error.value = null;
    debugInfo.value = null;
  }

  return {
    currentImage,
    recognizedObject,
    isLoading,
    error,
    debugInfo,
    objectsDatabase,
    hasRecognizedObject,
    setCurrentImage,
    recognizeObject,
    clearRecognition,
  };
});
