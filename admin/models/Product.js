import mongoose from "mongoose";
import {Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    title: {type: String, required: true},
    category: {type: mongoose.Types.ObjectId},
    description: String,
    price: {type: Number, required: true},
    images: [{type: String}],
    properties: {type: Object},
},{
    timestamps: true
});

export const Product = models.Product || model('Product', ProductSchema);