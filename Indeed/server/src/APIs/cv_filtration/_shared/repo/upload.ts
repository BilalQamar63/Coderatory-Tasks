import CV from '../models/cv.model';

export default {
     post_data : async(body : any) => {
        console.log(body);

        const a = await new CV({
            CV  : body.CV
        })
        let s =  await a.save();
        return s
     }
}