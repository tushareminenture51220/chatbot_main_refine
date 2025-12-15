const mongoose = require("mongoose");

const overAllPerformaceSchema = mongoose.Schema({
  Total_Unique_Users: Number,
  Total_Chatbot_Sessions: Number,
  Total_Users_Queries: Number,
  First_Contact_Resolution: Number,
  Queries_Resolution_LiveChat: Number,
});

const OverAllPerformaceModel = mongoose.model(
  "over_all_performance",
  overAllPerformaceSchema
);

module.exports = OverAllPerformaceModel;
