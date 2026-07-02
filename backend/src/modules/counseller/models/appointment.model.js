import mongoose from "mongoose";
import { User } from "../../auth/models/auth.model";

const counsellingAppointementSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Types.ObjectId,
        ref: User
    },
    counsellingType:{
        type: String,
        enum :["oncall", "ontext"]
    }
    
})