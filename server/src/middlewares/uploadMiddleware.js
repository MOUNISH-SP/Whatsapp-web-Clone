import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Establish a static directory mapping uploads functionally to the workspace root
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Securely inject timestamps avoiding duplicate naming collision parameters natively
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });
