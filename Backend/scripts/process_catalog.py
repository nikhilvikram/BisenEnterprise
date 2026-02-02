import os
import json
import cv2
import time
import numpy as np
import boto3
from google import genai
from PIL import Image
from ultralytics import YOLO
from pathlib import Path
from botocore.exceptions import NoCredentialsError

# --- CONFIGURATION ---
# Read from environment to avoid leaked keys in source control.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
INPUT_FOLDER = "inputs"
OUTPUT_FOLDER = "output_website"
MODEL_NAME = "gemini-2.0-flash"
LOG_FILE = "processed_log.json"

# AWS S3 Config
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
S3_REGION = os.getenv("AWS_REGION", "ap-south-1")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
yolo_model = YOLO("yolov8n.pt") 
s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, region_name=S3_REGION)

# --- HELPER: S3 UPLOAD ---
def upload_to_s3(local_file, s3_folder, file_name):
    s3_key = f"{s3_folder}/{file_name}"
    try:
        s3_client.upload_file(local_file, S3_BUCKET, s3_key)
        url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"
        return url
    except Exception as e:
        print(f"       ❌ S3 Upload Failed: {e}")
        return None

# --- LOGGING SYSTEM ---
def load_log():
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f: 
                data = json.load(f)
                if data and isinstance(data, list) and len(data) > 0 and isinstance(data[0], str): return [] 
                return data
        except: return []
    return []

def mark_as_processed(filename, design_path):
    log = load_log()
    entry = {"file": filename, "path": design_path}
    log = [x for x in log if isinstance(x, dict) and x.get('file') != filename]
    log.append(entry)
    with open(LOG_FILE, 'w') as f: json.dump(log, f, indent=2)

def get_processed_path(filename):
    log = load_log()
    for entry in log:
        if isinstance(entry, dict) and entry.get('file') == filename: return entry.get('path')
    return None

def get_rich_metadata(pil_image):
    prompt = """
    You are a professional fashion merchandiser. Analyze this image.
    1. CATEGORY RULES:
    - If 9-yard Maharashtrian saree -> 'Nauvari'
    - If pre-stitched/1-minute saree -> 'Ready-to-wear Saree'
    - If matching top/bottom set -> 'Co-ord Set'
    - If bra/panty -> 'Lingerie'
    - If Kurti with Pants/Plazo -> 'Kurti Set'
    - If long frock suit -> 'Anarkali'
    
    Return RAW JSON:
    {
        "category": "String (Choose: 'Saree', 'Nauvari', 'Ready-to-wear Saree', 'Lehenga', 'Kurti Set', 'Anarkali', 'Western', 'Co-ord Set', 'Nightwear', 'Lingerie', 'Gowns', 'Jewellery', 'Bags')",
        "design_code": "String (Design number or 'Unknown')",
        "product_title": "String (SEO Friendly)",
        "short_description": "String (Marketing copy)",
        "attributes": { "color": "String", "fabric": "String", "pattern": "String", "occasion": "String" },
        "tags": ["String", "String", "String"]
    }
    """
    if not client:
        print("    ⚠️ Missing GEMINI_API_KEY/GOOGLE_API_KEY in environment.")
        return None

    for i in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME, contents=[prompt, pil_image],
                config={'response_mime_type': 'application/json'}
            )
            if response.text:
                time.sleep(2) 
                return json.loads(response.text)
        except Exception as e:
            print(f"    ⚠️ AI Error: {e}")
            if "API key was reported as leaked" in str(e):
                return None
            time.sleep(2)
    return None

def make_perfect_crop(x1, y1, x2, y2, img_w, img_h):
    box_w, box_h = x2 - x1, y2 - y1
    center_x, center_y = x1 + (box_w / 2), y1 + (box_h / 2)
    display_h = int(box_h * 1.15)
    display_w = int(display_h * 0.75) 
    nx1 = int(center_x - (display_w / 2))
    nx2 = int(center_x + (display_w / 2))
    ny1 = int(center_y - (display_h / 2))
    ny2 = int(center_y + (display_h / 2))
    if ny1 < 0: ny2 += -ny1; ny1 = 0
    if ny2 > img_h: ny1 -= (ny2 - img_h); ny2 = img_h
    return max(0, nx1), max(0, ny1), min(img_w, nx2), min(img_h, ny2)

def process_single_page(pil_image, filename):
    print(f"    ⚡ Checking: {filename}...")
    
    # 🟢 DUPLICATE CHECK
    existing_path = get_processed_path(filename)
    if existing_path and os.path.exists(existing_path):
        json_file = os.path.join(existing_path, "product_info.json")
        if os.path.exists(json_file):
             print(f"       ⏭️ Already processed. Touching JSON to activate.")
             Path(json_file).touch()
             return

    # 1. AI Analysis
    api_img = pil_image.copy()
    api_img.thumbnail((1024, 1024))
    data = get_rich_metadata(api_img)
    if not data: return

    category = data.get("category", "General").title().replace(" ", "_")
    design_code_raw = data.get("design_code", "Unknown").replace("/", "_")
    design_code = f"{design_code_raw}_{int(time.time())}"

    # Local Temp Folder
    save_dir = os.path.join(OUTPUT_FOLDER, category, design_code)
    os.makedirs(save_dir, exist_ok=True)

    # 2. Process Images (YOLO)
    img_cv = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    h, w, _ = img_cv.shape
    results = yolo_model(pil_image, verbose=False)
    
    detections = []
    for r in results[0].boxes:
        if int(r.cls[0]) == 0 and float(r.conf[0]) > 0.40: detections.append(r.xyxy[0].tolist())
    detections.sort(key=lambda x: (x[2]-x[0])*(x[3]-x[1]), reverse=True)

    s3_image_urls = [] 

    pose_count = 0
    for box in detections:
        rx1, ry1, rx2, ry2 = box
        if (rx2 - rx1) < w * 0.15: continue
        pose_count += 1
        cx1, cy1, cx2, cy2 = make_perfect_crop(rx1, ry1, rx2, ry2, w, h)
        final_img = img_cv[cy1:cy2, cx1:cx2]
        
        if final_img.size > 0:
            local_name = f"pose_{pose_count}.jpg"
            local_path = os.path.join(save_dir, local_name)
            
            # Save Locally -> Upload S3 -> Delete Locally
            cv2.imwrite(local_path, final_img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
            print(f"       ☁️ Uploading: {local_name}...")
            s3_url = upload_to_s3(local_path, f"{category}/{design_code}", local_name)
            
            if s3_url:
                s3_image_urls.append(s3_url)
                
            os.remove(local_path) # 🟢 SAVE SPACE

    # 3. Save JSON (Keep this to track history)
    data["s3_images"] = s3_image_urls 
    
    json_path = os.path.join(save_dir, "product_info.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    mark_as_processed(filename, save_dir)

def main():
    if not os.path.exists(INPUT_FOLDER): os.makedirs(INPUT_FOLDER)
    files = os.listdir(INPUT_FOLDER)
    images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    
    if images:
        for img_file in images:
            img_path = os.path.join(INPUT_FOLDER, img_file)
            try:
                pil_img = Image.open(img_path)
                process_single_page(pil_img, img_file)
                pil_img.close()
                os.remove(img_path) 
                print(f"       🗑️ Cleaned up input: {img_file}")
            except Exception as e: print(f"       ⚠️ Error: {e}")

if __name__ == "__main__":
    main()