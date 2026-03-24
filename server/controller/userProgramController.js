const UserProgram = require("../models/UserProgram");
const User = require("../models/user");

// Get program for a specific user
exports.getUserProgram = async (req, res) => {
  try {
    const { userId } = req.params;
    let program = await UserProgram.findOne({ userId }).populate('userId', 'username email phone').populate('coachId', 'username email');
    
    // Auto-create an empty program if none exists for the user
    if (!program) {
      program = new UserProgram({ userId, status: 'waiting' });
      await program.save();
      program = await UserProgram.findOne({ userId }).populate('userId', 'username email phone').populate('coachId', 'username email');
    }
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update program by coach
exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingPlan, nutritionPlan, status } = req.body;
    
    let updateFields = { trainingPlan, nutritionPlan, rejectionReason: '' };
    if (status) {
      updateFields.status = status;
    } else {
      updateFields.status = 'waiting';
    }

    const program = await UserProgram.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Coach submits program to lead coach
exports.submitProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { coachId, coachNote } = req.body;

    let updateFields = { status: 'submitted' };
    if (coachId) updateFields.coachId = coachId;
    if (coachNote !== undefined) updateFields.coachNote = coachNote;

    const program = await UserProgram.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).populate('userId', 'username email');
    
    const Notification = require("../models/Notification");
    const notification = new Notification({
      targetRole: 'trainer_lead',
      title: "برنامج جديد قيد المراجعة",
      content: `تم تقديم برنامج جديد للمتدرب ${program.userId?.username || 'بدون اسم'}`,
      link: "/plans",
    });
    await notification.save();

    const io = req.app.get("io");
    if (io) io.emit("newNotification", notification);

    res.status(200).json({ message: "Program submitted successfully", program });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all programs (for lead coach and coach)
exports.getAllPrograms = async (req, res) => {
  try {
    // Bring all standard users
    const standardUsers = await User.find({ role: { $in: ['user', null, undefined, ""] } }).select('username email phone');
    
    // Bring all existing programs
    const existingPrograms = await UserProgram.find().populate('userId', 'username email phone').populate('coachId', 'username email');
    
    // Create a map for fast lookup
    const programsMap = {};
    existingPrograms.forEach(p => {
      if (p.userId) programsMap[p.userId._id.toString()] = p;
    });
    
    // Merge standard users that don't have a program yet
    const result = [];
    for (const user of standardUsers) {
      if (programsMap[user._id.toString()]) {
        result.push(programsMap[user._id.toString()]);
      } else {
        // Create an empty "mock" or save an initialized program for them inline.
        const newProgram = new UserProgram({ userId: user._id, status: 'waiting' });
        await newProgram.save();
        
        // Populate and push
        const populated = await UserProgram.findById(newProgram._id).populate('userId', 'username email phone');
        result.push(populated);
      }
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lead coach approves program
exports.approveProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await UserProgram.findByIdAndUpdate(
      id,
      { status: 'approved', rejectionReason: '' },
      { new: true }
    ).populate('userId', 'username email');

    const Notification = require("../models/Notification");
    const io = req.app.get("io");

    // Notification to related user
    if (program.userId) {
      const notifUser = new Notification({
        targetUserId: program.userId._id,
        title: "تمت الموافقة على برنامجك",
        content: "لقد تم اعتماد برنامجك التدريبي والغذائي.",
        link: "/plans",
      });
      await notifUser.save();
      if (io) io.emit("newNotification", notifUser);
    }
    
    // Notification to submitting coach
    if (program.coachId) {
      const notifCoach = new Notification({
        targetUserId: program.coachId,
        title: "تمت الموافقة على البرنامج",
        content: `تمت الموافقة على البرنامج الذي قدمته للمتدرب ${program.userId?.username || 'بدون اسم'}`,
        link: "/plans",
      });
      await notifCoach.save();
      if (io) io.emit("newNotification", notifCoach);
    }

    res.status(200).json({ message: "Program approved successfully", program });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lead coach rejects program
exports.rejectProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const program = await UserProgram.findByIdAndUpdate(
      id,
      { status: 'rejected', rejectionReason },
      { new: true }
    ).populate('userId', 'username email');

    if (program.coachId) {
      const Notification = require("../models/Notification");
      const notifCoach = new Notification({
        targetUserId: program.coachId,
        title: "تم رفض البرنامج",
        content: `تم رفض البرنامج المقدم للمتدرب ${program.userId?.username || 'بدون اسم'} بسبب: ${rejectionReason}`,
        link: "/plans",
      });
      await notifCoach.save();
      
      const io = req.app.get("io");
      if (io) io.emit("newNotification", notifCoach);
    }

    res.status(200).json({ message: "Program rejected successfully", program });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
