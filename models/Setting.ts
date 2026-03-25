import mongoose, { Schema, model, models } from "mongoose";

export interface ISetting {
    _id: string;
    showPrices: boolean;
}

const SettingSchema = new Schema<ISetting>(
    {
        showPrices: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Setting = models.Setting || model<ISetting>("Setting", SettingSchema);

export default Setting;
