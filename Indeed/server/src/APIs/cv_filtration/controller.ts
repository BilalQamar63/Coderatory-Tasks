import { Request, Response } from 'express'
import post from './_shared/repo/upload'

export default {
    upload:  async(request: Request, response: Response) => {
        try {
            const CV = await post.post_data(request.body);
            response.status(201).send({data : CV})
            
        } catch (error) {
            console.log(error)
          
        }
    },
    
   
}
