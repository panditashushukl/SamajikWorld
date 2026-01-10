import mongoose,{Schema} from 'mongoose'
import mongoogeAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const commentSchema = new Schema(
  {
    content : {
      type:String,
      required:true
    },
    video: {
      type: Schema.Types.ObjectId,
      ref:"Video"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true
    }
  },
  {
    timestamps:true
  }
)

commentSchema.plugin(mongoogeAggregatePaginate)

export const Comment = mongoose.model("Comment",commentSchema)