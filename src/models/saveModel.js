import mongoose from 'mongoose';

const saveCodeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique : true
    },
    codes: {
        type: Map,
        of: String,
        required: true
    },
}, { timestamps: true });

const SaveCode = mongoose.models.SaveCode || mongoose.model('SaveCode', saveCodeSchema);

export default SaveCode;
