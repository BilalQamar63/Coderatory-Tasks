import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    title: string;          
    description: string;    
    requirements: string[]; 
    applicants: string[];  
}

const JobSchema: Schema<IJob> = new Schema({
    title: { type: String, required: true },       
    description: { type: String, required: true },  
    requirements: { type: [String], default: [] },   
    applicants: { type: [String], default: [] },      
}, {
    timestamps: true
});

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
