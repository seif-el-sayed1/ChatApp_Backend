const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const User = require("../models/user.model");

const SocketController = require("../controllers/socket.controller");
const { sendNotification } = require("../utils/sendNotification");

const onlineUsers = new Set();
const chatRoomUsers = {};
let io;

// Authenticate user using JWT, check token, account status, and password change
const getUserDetails = async (socket, token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) return socket.emit("error", "User not found");
    if (currentUser.token !== token) return socket.emit("error", "Session expired");
    if (!currentUser.isActive) return socket.emit("error", "Account deactivated");
    if (currentUser.isBlocked) return socket.emit("error", "Account blocked");
    if (currentUser.passwordChangedAt && parseInt(currentUser.passwordChangedAt.getTime()/1000,10) > decoded.iat)
      return socket.emit("error", "Password changed, login again");
    return currentUser;
  } catch (error) {
    socket.emit("error", "Authentication error: " + error.message);
  }
};
