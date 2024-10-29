import CV from '../models/cv.model';   

export const getAllCVs = async (req:any, res:any) => {
  try {
    const cvs = await CV.find(); 
    console.log(req)
    return res.status(200).json({
      totalCVs: cvs.length,
      cvs,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

import express from 'express';
import { uploadCv } from './cvController';

const router = express.Router();
router.get('/cvs', uploadCv);
export default router;
