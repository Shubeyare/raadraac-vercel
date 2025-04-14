import { ref, computed } from "vue";
import { useObjectStore } from "../stores/objectStore";

export function useImageCapture() {
  const imageFile = ref<File | null>(null);
  const imageSrc = ref<string | null>(null);
  const isCapturing = ref(false);
  const error = ref<string | null>(null);
  const videoRef = ref<HTMLVideoElement | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const objectStore = useObjectStore();
  const processingImage = ref(false);

  // Define max dimensions for resizing
  const MAX_WIDTH = 1280;
  const MAX_HEIGHT = 1280;
  const JPEG_QUALITY = 0.85; // 85% quality for JPEG

  const hasImage = computed(() => !!imageSrc.value);

  // Resize and optimize image
  const resizeAndOptimizeImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        // Only resize if the image is larger than max dimensions
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
        }

        // Create a canvas element for resizing
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Use higher quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Apply a subtle background before drawing the image
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL with quality setting
        const mimeType = "image/jpeg";
        const optimizedDataUrl = canvas.toDataURL(mimeType, JPEG_QUALITY);

        console.log(
          `Original size: ${img.width}x${img.height}, Resized: ${width}x${height}`
        );
        resolve(optimizedDataUrl);
      };

      img.onerror = () => {
        reject(new Error("Error loading image for resizing"));
      };

      img.src = dataUrl;
    });
  };

  // Handle file uploads
  const handleFileUpload = (event: Event) => {
    console.log("File upload triggered");
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.log("No files selected");
      return;
    }

    const file = input.files[0];
    processFile(file);
  };

  // Handle drag and drop
  const handleDrop = (event: DragEvent) => {
    console.log("Drop event triggered");
    if (!event.dataTransfer) {
      console.log("No dataTransfer in drop event");
      return;
    }

    event.preventDefault();

    if (event.dataTransfer.files.length) {
      const file = event.dataTransfer.files[0];
      processFile(file);
    } else {
      console.log("No files in drop event");
    }
  };

  // Process the file and convert to data URL
  const processFile = (file: File) => {
    error.value = null;
    processingImage.value = true;
    console.log("Processing file:", file.name, file.type, file.size);

    // Check if file is an image
    if (!file.type.match("image.*")) {
      error.value = "Please select an image file";
      console.error("Not an image file");
      processingImage.value = false;
      return;
    }

    imageFile.value = file;

    // Create a data URL from the file and resize
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        console.log("File loaded successfully");
        const dataUrl = e.target.result.toString();

        // Resize and optimize the image
        resizeAndOptimizeImage(dataUrl)
          .then((optimizedDataUrl) => {
            console.log("Image resized and optimized");
            imageSrc.value = optimizedDataUrl;
            objectStore.setCurrentImage(optimizedDataUrl);
            processingImage.value = false;
          })
          .catch((err) => {
            console.error("Error optimizing image:", err);
            // Fall back to original image if resizing fails
            imageSrc.value = dataUrl;
            objectStore.setCurrentImage(dataUrl);
            processingImage.value = false;
          });
      }
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      error.value = "Error reading file";
      processingImage.value = false;
    };
    reader.readAsDataURL(file);
  };

  // Start camera capture
  const startCamera = async () => {
    isCapturing.value = true;
    error.value = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
      }
    } catch (err) {
      isCapturing.value = false;
      error.value = "Could not access camera";
      console.error("Camera access error:", err);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.value || !canvasRef.value) return;
    processingImage.value = true;

    const video = videoRef.value;
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");

    if (!context) {
      processingImage.value = false;
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL with quality setting
    const capturedDataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

    // Resize and optimize the captured image
    resizeAndOptimizeImage(capturedDataUrl)
      .then((optimizedDataUrl) => {
        imageSrc.value = optimizedDataUrl;
        objectStore.setCurrentImage(optimizedDataUrl);
        processingImage.value = false;
      })
      .catch((err) => {
        console.error("Error optimizing captured image:", err);
        // Fall back to original capture if resizing fails
        imageSrc.value = capturedDataUrl;
        objectStore.setCurrentImage(capturedDataUrl);
        processingImage.value = false;
      });

    // Stop the camera stream
    stopCamera();
  };

  // Stop camera capture
  const stopCamera = () => {
    if (videoRef.value && videoRef.value.srcObject) {
      const stream = videoRef.value.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.value.srcObject = null;
    }

    isCapturing.value = false;
  };

  // Reset everything
  const reset = () => {
    imageSrc.value = null;
    imageFile.value = null;
    error.value = null;
    processingImage.value = false;
    objectStore.clearRecognition();

    // If camera is active, stop it
    if (isCapturing.value) {
      stopCamera();
    }
  };

  return {
    imageFile,
    imageSrc,
    isCapturing,
    error,
    videoRef,
    canvasRef,
    hasImage,
    processingImage,
    handleFileUpload,
    handleDrop,
    startCamera,
    captureImage,
    stopCamera,
    reset,
  };
}
