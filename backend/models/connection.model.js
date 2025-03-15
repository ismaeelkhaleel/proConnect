import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status_accepted: {
        type: Boolean,
        default: null
    }
}, { timestamps: true });

const ConnectionRequest = mongoose.model("Connectionrequest", connectionSchema);

export default ConnectionRequest;