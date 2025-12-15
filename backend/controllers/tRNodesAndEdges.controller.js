const TRNodesAndEdgeModel = require("../model/TRNodesAndEdgesSchema");
const mongoose = require("mongoose");
const createTRNodesAndEdges = async (req, res) => {
  try {
    const TRNodesAndEdge = await TRNodesAndEdgeModel.create(req.body);

    if (TRNodesAndEdge) {
      // Corrected variable name
      return res.status(200).send({
        status: "success",
        message: "trNodesAndEdges Updated successfully!",
        TRNodesAndEdge,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to add trNodesAndEdges to the database",
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Error Occurred" });
  }
};

const getTRNodesAndEdgesData = async (req, res) => {
  try {
    const adminId = req.params.id;
    const TRNodesAndEdge = await TRNodesAndEdgeModel.findOne({ adminId });
    if (TRNodesAndEdge) {
      return res.status(200).send({
        status: "success",
        TRNodesAndEdge,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "failed to find trNodesAndEdges to the database",
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Error Occured" });
  }
};

const getTRNodesAndEdgesDataWidget = async (req, res) => {
  try {
    const adminId = req.params.id;
    const TRNodesAndEdge = await TRNodesAndEdgeModel.findOne({ adminId });
    if (TRNodesAndEdge) {
      return res.status(200).send({
        status: "success",
        nodes: TRNodesAndEdge.tRNodes,
        edges: TRNodesAndEdge.tREdges,
        outOfFlowData: TRNodesAndEdge.outOfFlowData,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "failed to find trNodesAndEdges to the database",
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Error Occured" });
  }
};
// const updateTRNodesAndEdges = async (req, res) => {
//   try {
//     const adminId = req.params.id;
//     const updatedTRNodeEdge = await TRNodesAndEdgeModel.findOne({ adminId });
//     if (updatedTRNodeEdge) {
//       updatedTRNodeEdge.tRNodes = req.body.tRNodes;
//       updatedTRNodeEdge.tREdges = req.body.tREdges;
//       updatedTRNodeEdge.save();
//       return res.status(200).send({
//         status: "success",
//         message: "trNodesAndEdges updated successfully!",
//         updatedTRNodeEdge,
//       });
//     } else {
//       return res.status(404).json({
//         status: "error",
//         message: "trNodesAndEdges not found",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal server error" });
//   }
// };

function isObjectNotEmpty(obj) {
  if (obj === undefined || obj === null) {
    return false;
  }
  return Object.keys(obj).length > 0;
}
const updateTRNodesAndEdges = async (req, res) => {
  const maxRetries = 5;
  let retries = 0;

  const updateDocument = async () => {
    try {
      // console.log(req.body);
      const adminId = req.params.id;
      const updatedTRNodeEdge = await TRNodesAndEdgeModel.findOne({ adminId });
      if (updatedTRNodeEdge) {
        updatedTRNodeEdge.tRNodes = req.body.tRNodes;
        updatedTRNodeEdge.tREdges = req.body.tREdges;
        if (isObjectNotEmpty(req.body.outOfFlowData)) {
          updatedTRNodeEdge.outOfFlowData = req.body.outOfFlowData;
        }

        await updatedTRNodeEdge.save();
        return res.status(200).send({
          status: "success",
          message: "trNodesAndEdges updated successfully!",
          updatedTRNodeEdge,
        });
      } else {
        const createData = await TRNodesAndEdgeModel.create(req.body);
        createData.save();

        return res.status(404).json({
          status: "error",
          message: "trNodesAndEdges not found but created successfully",
        });
      }
    } catch (error) {
      if (error instanceof mongoose.Error.VersionError) {
        retries++;
        if (retries < maxRetries) {
          console.log(
            `Version conflict encountered. Retry attempt: ${retries}`
          );
          return updateDocument(); // Retry the update
        } else {
          return res.status(500).json({
            status: "error",
            message:
              "Max retries reached. Could not update document due to version conflict.",
          });
        }
      } else {
        console.error(error);
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  };

  updateDocument();
};

//delete one edge
const deleteTREdge = async (req, res) => {
  try {
    const { adminId, edgeId } = req.params;
    const edgeTR = await TRNodesAndEdgeModel.findOne({ adminId });
    if (!edgeTR) {
      return res.status(404).json({
        status: "error",
        message: "edgeTR not found",
      });
    }

    edgeTR.tREdges = edgeTR.tREdges.filter((edge) => edge.id !== edgeId);

    await edgeTR.save();

    return res.status(200).send({
      status: "success",
      message: "Edge deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

//delete one node
const deleteTRNode = async (req, res) => {
  try {
    const { adminId, nodeId } = req.params;

    const nodeTR = await TRNodesAndEdgeModel.findOne({ adminId });

    if (!nodeTR) {
      return res.status(404).json({
        status: "error",
        message: "nodeTR not found",
      });
    }

    nodeTR.tREdges = nodeTR.tREdges.filter((node) => node.id !== nodeId);

    await nodeTR.save();

    return res.status(200).send({
      status: "success",
      message: "node deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTRNodesAndEdges,
  getTRNodesAndEdgesData,
  getTRNodesAndEdgesDataWidget,
  updateTRNodesAndEdges,
  deleteTREdge,
  deleteTRNode,
};
