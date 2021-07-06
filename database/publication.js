const mongoose = require("mongoose");

// Author schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// Author Model 
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;