const OverAllPerformaceModel = require("../model/OverAllPerformanceSchema");

const getPerformanceData = async (req, res) => {
  try {
    const performanceData = await OverAllPerformaceModel.findOne({
      _id: "658538fc59803311c99355fe",
    });
    if (performanceData) {
      return res.status(200).json({ status: "success", performanceData });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { getPerformanceData };
