const { Router } = require("express");
const auth = require("../middlewares/auth");

const {
  createTRNodesAndEdges,
  updateTRNodesAndEdges,
  getTRNodesAndEdgesData,
  getTRNodesAndEdgesDataWidget,
  deleteTREdge,
  deleteTRNode,
} = require("../controllers/tRNodesAndEdges.controller");

const newTRRouter = Router();

// create nodes and edges
newTRRouter.post("/createNodeAndEdges", auth, createTRNodesAndEdges);

// get nodes and edges
newTRRouter.get("/getNodeAndEdges/:id", auth, getTRNodesAndEdgesData);
// get nodes and edges - widget
newTRRouter.get("/getNodeAndEdgesWidget/:id", getTRNodesAndEdgesDataWidget);

// update nodes and edges
newTRRouter.patch("/updateNodeAndEdges/:id", auth, updateTRNodesAndEdges);

// delete edge
newTRRouter.delete("/deleteTR/:adminId/edge/:edgeId", auth, deleteTREdge);

// delete node
newTRRouter.delete("/deleteTR/:adminId/node/:nodeId", auth, deleteTRNode);

module.exports = newTRRouter;
