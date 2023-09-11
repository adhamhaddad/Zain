import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD = 'uploads/post-vidoes';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/webm' ||
      file.mimetype === 'video/ogg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .mp4, .webm, .ogg video formats allowed!'));
    }
  }
}).fields([{ name: 'post_video', maxCount: 2 }]);

export default upload;
