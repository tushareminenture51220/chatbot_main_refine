const mongoose = require("mongoose");

const tRNodesSchema = mongoose.Schema({
  id: { type: String },
  position: {
    x: { type: Number },
    y: { type: Number },
  },

  data: {
    connections: { type: Object },
    triggerType: { type: String },
    message: { type: Object },
    iconName: { type: String },
    trigger_Name: { type: String },
    nodeHandles: { type: Number },
    decisiontrigger: { type: String, default: false },
    howItsWorksText: { type: String },
    nextActionDelayTime: { type: Number, default: 0 },
  },
  type: { type: String },
  width: { type: Number },
  height: { type: Number },
  selected: { type: Boolean },
  dragging: { type: Boolean },
});

const tREdgesSchema = mongoose.Schema({
  source: {
    type: String,
  },
  sourceHandle: {
    type: String,
    default: null,
  },
  target: {
    type: String,
  },
  targetHandle: {
    type: String,
    default: null,
  },
  id: {
    type: String,
  },
  type: {
    type: String,
  },
  label: {
    type: String,
    default: "",
  },
});

const tRNodesAndEdgesSchema = mongoose.Schema(
  {
    adminId: { type: String },
    tRNodes: { type: [tRNodesSchema], default: [] },
    tREdges: { type: [tREdgesSchema], default: [] },
    outOfFlowData: { type: Object },
  },
  { timestamps: true }
);

const TRNodesAndEdgeModel = mongoose.model(
  "TRNodesAndEdge",
  tRNodesAndEdgesSchema
);

module.exports = TRNodesAndEdgeModel;
