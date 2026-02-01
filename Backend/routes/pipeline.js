const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const redisClient = require("../config/redis");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./inputs";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage: storage });

// Helper for Slugs
const createSlug = (text) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

// ==================================================
// ROUTE 1: PROCESS
// ==================================================
router.post("/process", upload.single("file"), (req, res) => {
  try {
    console.log("⚡ Starting Cloud AI Pipeline...");
    // Look back 2 seconds to catch file touches
    const startTime = Date.now() - 2000;

    const pythonBin =
      process.env.PYTHON_BIN ||
      (process.platform === "win32" ? "python" : "python3");
    const pythonProcess = spawn(pythonBin, ["scripts/process_catalog.py"]);
    pythonProcess.stdout.on("data", (data) => console.log(`🐍 ${data}`));
    pythonProcess.stderr.on("data", (data) => console.error(`🐍 Err: ${data}`));

    pythonProcess.on("close", (code) => {
      console.log(`✅ Pipeline Finished (Code ${code})`);
      const outputDir = "./output_website";
      const results = [];

      if (fs.existsSync(outputDir)) {
        const categories = fs.readdirSync(outputDir);
        categories.forEach((cat) => {
          const catPath = path.join(outputDir, cat);
          if (fs.lstatSync(catPath).isDirectory()) {
            const designs = fs.readdirSync(catPath);
            designs.forEach((design) => {
              const designPath = path.join(catPath, design);
              const jsonPath = path.join(designPath, "product_info.json");

              if (fs.existsSync(jsonPath)) {
                // Check if file was created OR "touched" recently
                if (fs.statSync(jsonPath).mtimeMs > startTime) {
                  const rawData = fs.readFileSync(jsonPath);
                  const jsonData = JSON.parse(rawData);

                  // 🟢 Use S3 Links. Fallback to local if upload failed.
                  jsonData.localImages = jsonData.s3_images || [];

                  // If S3 array is empty (old file), try to use local images if they exist
                  if (jsonData.localImages.length === 0) {
                    const imgFiles = fs
                      .readdirSync(designPath)
                      .filter((f) => f.endsWith(".jpg"));
                    jsonData.localImages = imgFiles.map(
                      (img) => `/output_website/${cat}/${design}/${img}`
                    );
                  }

                  jsonData.folderPath = designPath;
                  results.push(jsonData);
                }
              }
            });
          }
        });
      }

      console.log(`🔍 Found ${results.length} active products.`);
      res.json({ success: true, products: results });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pipeline Failed" });
  }
});

// ==================================================
// ROUTE 2: PUBLISH (With S3 + Duplicate Logic)
// ==================================================
// router.post("/publish", async (req, res) => {
//   try {
//     const { products } = req.body;
//     let updatedCount = 0;
//     let createdCount = 0;

//     for (const p of products) {
//       const uniqueImageKey = p.localImages[0];

//       // 🟢 CHECK: Image URL match OR Title match
//       let existingProduct = await Product.findOne({
//         $or: [{ images: uniqueImageKey }, { title: p.product_title }]
//       });

//       if (existingProduct) {
//         console.log(`   🔄 Updating: ${existingProduct.title}`);
//         existingProduct.price = p.price;
//         existingProduct.stock = p.stock;

//         // Merge new images if they are different
//         const newImages = p.localImages.filter(img => !existingProduct.images.includes(img));
//         if (newImages.length > 0) existingProduct.images.push(...newImages);

//         await existingProduct.save();
//         updatedCount++;
//       } else {
//         console.log(`   ✨ Creating: ${p.product_title}`);
//         const slug = createSlug(p.product_title) + "-" + Date.now();
//         const newProduct = new Product({
//           title: p.product_title, slug: slug, description: p.short_description,
//           category: p.category, price: p.price, stock: p.stock,
//           images: p.localImages,
//           attributes: p.attributes, tags: p.tags
//         });
//         await newProduct.save();
//         createdCount++;
//       }

//       // 🛑 STOP DELETING THE JSON FOLDER HERE!
//       // We keep the folder + json so Python can detect duplicates next time.
//       // Python handles deleting the heavy images.
//     }

//     if (redisClient && redisClient.isOpen) await redisClient.del("active_products");
//     res.json({ success: true, msg: `Done! ${updatedCount} Updated, ${createdCount} New.` });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Publish Failed" });
//   }
// });

// ==================================================
// ROUTE 2: PUBLISH (Saves S3 Links + Updates JSON)
// ==================================================
router.post("/publish", async (req, res) => {
  try {
    const { products } = req.body;
    let updatedCount = 0;
    let createdCount = 0;

    for (const p of products) {
      const uniqueImageKey = p.localImages[0];

      // 1. DATABASE SAVE (Mongo)
      let existingProduct = await Product.findOne({
        $or: [{ images: uniqueImageKey }, { title: p.product_title }]
      });

      if (existingProduct) {
        console.log(`   🔄 Updating: ${existingProduct.title}`);

        // Update editable fields
        existingProduct.price = p.price;
        existingProduct.stock = p.stock;
        existingProduct.category = p.category; // 🟢 Update Category in DB
        existingProduct.title = p.product_title; // 🟢 Update Title in DB
        existingProduct.description = p.short_description; // 🟢 Update Desc in DB

        // Merge new images
        const newImages = p.localImages.filter(img => !existingProduct.images.includes(img));
        if (newImages.length > 0) existingProduct.images.push(...newImages);

        await existingProduct.save();
        updatedCount++;
      } else {
        console.log(`   ✨ Creating: ${p.product_title}`);
        const slug = createSlug(p.product_title) + "-" + Date.now();

        const newProduct = new Product({
          title: p.product_title,
          slug: slug,
          description: p.short_description,
          category: p.category, // 🟢 Save User-Selected Category
          price: p.price,
          stock: p.stock,
          images: p.localImages,
          attributes: p.attributes,
          tags: p.tags
        });
        await newProduct.save();
        createdCount++;
      }

      // 🟢 2. JSON FILE UPDATE (The Memory Logic)
      // If user changed category, we update the local JSON so Python remembers it next time.
      if (p.folderPath && fs.existsSync(p.folderPath)) {
        const jsonPath = path.join(p.folderPath, "product_info.json");

        if (fs.existsSync(jsonPath)) {
          try {
            const rawData = fs.readFileSync(jsonPath);
            const jsonData = JSON.parse(rawData);

            // Only write if something changed
            if (jsonData.category !== p.category || jsonData.product_title !== p.product_title) {
              jsonData.category = p.category;
              jsonData.product_title = p.product_title;
              jsonData.short_description = p.short_description;

              fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 4));
              console.log(`       📝 Updated local JSON memory for: ${p.product_title}`);
            }
          } catch (err) {
            console.error("       ⚠️ Failed to update local JSON:", err.message);
          }
        }
      }
    }

    if (redisClient && redisClient.isOpen) await redisClient.del("active_products");
    res.json({ success: true, msg: `Done! ${updatedCount} Updated, ${createdCount} New.` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Publish Failed" });
  }
});

module.exports = router;