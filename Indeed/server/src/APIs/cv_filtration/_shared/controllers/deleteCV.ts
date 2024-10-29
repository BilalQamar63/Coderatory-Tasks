import CV from '../models/cv.model';
import { Response, Request } from 'express';

export const deleteCV = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedCV = await CV.findByIdAndDelete(id);

        if (!deletedCV) {
            return res.status(404).json({ message: 'CV not found' });
        }

        return res.status(200).json({ message: 'CV deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting CV', error });
    }
};
