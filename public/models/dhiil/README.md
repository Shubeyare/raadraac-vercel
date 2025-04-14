# Teachable Machine Model for Dhiil Recognition

This directory contains placeholder files for a Teachable Machine model that recognizes "dhiil" (traditional Somali milk container). To use a real model:

## How to Replace with Your Own Model

1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/train/image)
2. Create a new image project with at least two classes:

   - "dhiil" - images of Somali milk containers
   - "not_dhiil" - images of other objects

3. Train your model with at least 30-50 images per class for better accuracy

4. After training, click "Export Model" and choose "Tensorflow.js"

5. Download the model and replace these files:
   - `model.json` - The model architecture
   - `metadata.json` - Information about the model classes
   - `weights.bin` - The actual trained weights (binary file)

## Tips for Better Recognition

- Include images of dhiil from different angles
- Use varied lighting conditions
- Include some images with hands holding the dhiil
- Include different types/styles of dhiil
- For "not_dhiil", include other Somali cultural objects and common household items

## Testing Your Model

After replacing these files, restart your development server and test the model with new images of dhiil. The confidence threshold is set to 0.65 (65%) in the app, but you can adjust this in the `objectStore.ts` file if needed.

The file structure should look like:

```
public/
└── models/
    └── dhiil/
        ├── model.json
        ├── metadata.json
        └── weights.bin
```
