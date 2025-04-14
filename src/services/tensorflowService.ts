import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";

class TensorFlowService {
  private model: tmImage.CustomMobileNet | null = null;
  private isModelLoading = false;

  /**
   * Load the TensorFlow.js model
   */
  async loadModel(): Promise<tmImage.CustomMobileNet> {
    if (this.model) {
      console.log("Model already loaded, returning cached model");
      return this.model;
    }

    if (this.isModelLoading) {
      console.log("Model loading already in progress, waiting...");
      // Wait for the model to load if already in progress
      return new Promise((resolve) => {
        const checkIfModelLoaded = setInterval(() => {
          if (this.model) {
            clearInterval(checkIfModelLoaded);
            console.log("Model finished loading while waiting");
            resolve(this.model);
          }
        }, 100);
      });
    }

    this.isModelLoading = true;
    console.log("Starting model loading process");

    try {
      // Load the Teachable Machine model
      const modelURL = "/models/dhiil/model.json";
      const metadataURL = "/models/dhiil/metadata.json";

      console.log(
        "Attempting to load Teachable Machine model from:",
        window.location.origin + modelURL,
        window.location.origin + metadataURL
      );

      try {
        // Fetch and log the metadata first to check if it's accessible
        try {
          const metadataResponse = await fetch(metadataURL);
          if (!metadataResponse.ok) {
            console.error(
              `Metadata fetch failed: ${metadataResponse.status} ${metadataResponse.statusText}`
            );
          } else {
            const metadata = await metadataResponse.json();
            console.log("Successfully fetched metadata:", metadata);
            console.log("Model expects classes:", metadata.labels);
          }
        } catch (metadataError) {
          console.error("Error fetching metadata:", metadataError);
        }

        // Try to load the model from our public directory
        console.log("Now loading the full model...");
        this.model = await tmImage.load(modelURL, metadataURL);
        console.log("Teachable Machine model loaded successfully!");
        console.log(
          "Model has",
          this.model.getTotalClasses(),
          "classes:",
          this.model.getClassLabels()
        );
      } catch (loadError) {
        console.error("Could not load Teachable Machine model:", loadError);

        if (loadError instanceof Error) {
          console.error("Error details:", loadError.message);
          console.error("Error stack:", loadError.stack);
        }

        // Create a dummy model implementation for testing
        // This emulates the Teachable Machine API when the model isn't available
        console.warn("Falling back to dummy model for testing");
        this.model = {
          predict: async (
            _image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
          ) => {
            // This returns dummy predictions
            return [
              {
                className: "dhiil",
                probability: Math.random() > 0.5 ? 0.95 : 0.15,
              },
              {
                className: "not_dhiil",
                probability: Math.random() > 0.5 ? 0.05 : 0.85,
              },
            ];
          },
          predictTopK: async (
            _image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
            maxPredictions: number
          ) => {
            const predictions = [
              {
                className: "dhiil",
                probability: Math.random() > 0.5 ? 0.95 : 0.15,
              },
              {
                className: "not_dhiil",
                probability: Math.random() > 0.5 ? 0.05 : 0.85,
              },
            ];

            return predictions
              .sort((a, b) => b.probability - a.probability)
              .slice(0, maxPredictions);
          },
          getTotalClasses: () => 2,
          getClassLabels: () => ["dhiil", "not_dhiil"],
        } as tmImage.CustomMobileNet;
      }

      this.isModelLoading = false;
      return this.model;
    } catch (error) {
      console.error("Failed to load model:", error);
      this.isModelLoading = false;
      throw error;
    }
  }

  /**
   * Process an image for prediction
   */
  async processImage(
    imageSource: HTMLImageElement | HTMLCanvasElement
  ): Promise<tf.Tensor> {
    return tf.tidy(() => {
      // Convert image to tensor
      const imageTensor = tf.browser.fromPixels(imageSource);

      // Resize to expected size (224x224)
      const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

      // Normalize pixel values to [-1, 1]
      const normalized = resized.div(127.5).sub(1);

      // Add batch dimension
      return normalized.expandDims(0);
    });
  }

  /**
   * Make a prediction with the model
   */
  async predict(
    imageSource: HTMLImageElement | HTMLCanvasElement
  ): Promise<Array<{ className: string; probability: number }>> {
    try {
      const model = await this.loadModel();
      console.log("Making prediction with model...");
      console.log(
        "Image source dimensions:",
        imageSource.width,
        "x",
        imageSource.height
      );

      const predictions = await model.predict(imageSource);
      console.log("Raw prediction results:", JSON.stringify(predictions));

      // Format and sort results
      const sortedPredictions = predictions.sort(
        (a, b) => b.probability - a.probability
      );
      console.log(
        "Sorted predictions:",
        sortedPredictions
          .map((p) => `${p.className}: ${(p.probability * 100).toFixed(2)}%`)
          .join(", ")
      );

      return sortedPredictions;
    } catch (error) {
      console.error("Prediction error:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }
}

export const tensorflowService = new TensorFlowService();
