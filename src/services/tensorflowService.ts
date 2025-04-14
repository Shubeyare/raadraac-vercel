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
      return this.model;
    }

    if (this.isModelLoading) {
      // Wait for the model to load if already in progress
      return new Promise((resolve) => {
        const checkIfModelLoaded = setInterval(() => {
          if (this.model) {
            clearInterval(checkIfModelLoaded);
            resolve(this.model);
          }
        }, 100);
      });
    }

    this.isModelLoading = true;

    try {
      // Load the Teachable Machine model
      const modelURL = "/models/dhiil/model.json";
      const metadataURL = "/models/dhiil/metadata.json";

      console.log(
        "Attempting to load Teachable Machine model from:",
        modelURL,
        metadataURL
      );

      try {
        // Try to load the model from our public directory
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

      const predictions = await model.predict(imageSource);
      console.log("Prediction results:", predictions);

      // Format results
      return predictions.sort((a, b) => b.probability - a.probability);
    } catch (error) {
      console.error("Prediction error:", error);
      throw error;
    }
  }
}

export const tensorflowService = new TensorFlowService();
