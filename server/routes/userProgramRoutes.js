const express = require("express");
const router = express.Router();
const userProgramController = require("../controller/userProgramController");

router.get("/user/:userId", userProgramController.getUserProgram);

router.put("/:id", userProgramController.updateProgram);

router.post("/:id/submit", userProgramController.submitProgram);

router.get("/", userProgramController.getAllPrograms);

router.post("/:id/approve", userProgramController.approveProgram);

router.post("/:id/reject", userProgramController.rejectProgram);

module.exports = router;
