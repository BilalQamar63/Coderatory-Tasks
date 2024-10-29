import mongoose, { Document, Schema } from 'mongoose'

export interface ICV extends Document {
    pdfUrl: string
    gmail: string
    RequiredSkills?: string[]
    matchedSkills?: string[]
    percentage: number
    status: string
    jobId: mongoose.Schema.Types.ObjectId
    jobTitle: string
}

const CVSchema: Schema<ICV> = new Schema(
    {
        pdfUrl: { type: String, required: true },
        gmail: { type: String, required: true },
        RequiredSkills: { type: [String], default: [] },
        matchedSkills: { type: [String], default: [] },
        percentage: { type: Number, required: true },
        status: { type: String },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        jobTitle: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

const CV = mongoose.model<ICV>('CV', CVSchema)

export default CV
