import { InferSchemaType, Schema, model } from 'mongoose';

// one login user id , and secound is target  person chat user id
const conversionSchema = new Schema({
  members: {
    type: Array,
    required: true,
  },
});

type conversionType = InferSchemaType<typeof conversionSchema>;

const conversion = model<conversionType>('Conversion', conversionSchema);
export default conversion;
