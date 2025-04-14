import Dexie from "dexie";
import type { Table } from "dexie";
import type { SomaliObject } from "../stores/objectStore";

// Define the database
class RaadraacDatabase extends Dexie {
  somaliObjects!: Table<SomaliObject, string>;

  constructor() {
    super("raadraacDb");

    // Define the schema
    this.version(1).stores({
      somaliObjects:
        "id, nameEn, nameSo, material, traditionalUse, culturalInsight, region, pronunciation, proverb, imageUrl",
    });
  }

  // Initialize database with sample data
  async initializeSampleData() {
    const count = await this.somaliObjects.count();

    // Only populate if no existing data
    if (count === 0) {
      const sampleObjects: SomaliObject[] = [
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
      ];

      try {
        await this.somaliObjects.bulkAdd(sampleObjects);
        console.log("Sample data initialized successfully");
      } catch (error) {
        console.error("Error initializing sample data:", error);
      }
    }
  }

  // Get an object by ID
  async getObjectById(id: string): Promise<SomaliObject | undefined> {
    return this.somaliObjects.get(id);
  }

  // Get all objects
  async getAllObjects(): Promise<SomaliObject[]> {
    return this.somaliObjects.toArray();
  }

  // Add a new object
  async addObject(object: SomaliObject): Promise<string> {
    return this.somaliObjects.add(object);
  }

  // Update an existing object
  async updateObject(object: SomaliObject): Promise<number> {
    return this.somaliObjects.update(object.id, object);
  }

  // Delete an object
  async deleteObject(id: string): Promise<void> {
    return this.somaliObjects.delete(id);
  }
}

// Create and export a singleton instance
export const db = new RaadraacDatabase();

// Initialize the database when imported
db.initializeSampleData().catch(console.error);
