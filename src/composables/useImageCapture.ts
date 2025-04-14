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

  const hasImage = computed(() => !!imageSrc.value);

  // Handle file uploads
  const handleFileUpload = (event: Event) => {
    console.log('File upload triggered');
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.log('No files selected');
      return;
    }

    const file = input.files[0];
    processFile(file);
  };

  // Handle drag and drop
  const handleDrop = (event: DragEvent) => {
    console.log('Drop event triggered');
    if (!event.dataTransfer) {
      console.log('No dataTransfer in drop event');
      return;
    }

    event.preventDefault();

    if (event.dataTransfer.files.length) {
      const file = event.dataTransfer.files[0];
      processFile(file);
    } else {
      console.log('No files in drop event');
    }
  };

  // Process the file and convert to data URL
  const processFile = (file: File) => {
    error.value = null;
    console.log('Processing file:', file.name, file.type, file.size);

    // Check if file is an image
    if (!file.type.match("image.*")) {
      error.value = "Please select an image file";
      console.error('Not an image file');
      return;
    }

    imageFile.value = file;

    // Create a data URL from the file
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        console.log('File loaded successfully, setting image source');
        imageSrc.value = e.target.result.toString();
        objectStore.setCurrentImage(imageSrc.value);
      }
    };
    reader.onerror = (e) => {
      console.error('Error reading file:', e);
      error.value = "Error reading file";
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
      console.error(err);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.value || !canvasRef.value) return;

    const video = videoRef.value;
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    imageSrc.value = canvas.toDataURL("image/jpeg");
    objectStore.setCurrentImage(imageSrc.value);

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
    handleFileUpload,
    handleDrop,
    startCamera,
    captureImage,
    stopCamera,
    reset,
  };
}
