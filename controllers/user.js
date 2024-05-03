// Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

// Check for Duplicate Email
module.exports.checkDuplicateEmail = (req, res) => {
  User.find({ email: req.body.email }).then((result) => {
    if (result.length > 0) {
      return res.status(409).send({ error: "Duplicate Email Found" });
    } else {
      return res.status(200).send({ message: "No Duplicate Email Found" });
    }
  });
};

// Register New User
module.exports.registerUser = (req, res) => {
  User.find({ email: req.body.email }).then((result) => {
    if (result.length > 0) {
      return res.status(409).send({ error: "Duplicate Email Found" });
    } else {
      if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
      } else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ error: "Mobile number invalid" });
      }
      // Checks if the password has atleast 8 characters
      else if (req.body.password.length < 8) {
        return res
          .status(400)
          .send({ error: "Password must be atleast 8 characters" });
        // If all needed requirements are achieved
      } else {
        let newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobileNo: req.body.mobileNo,
          password: bcrypt.hashSync(req.body.password, 10),
        });

        return newUser
          .save()
          .then((result) =>
            res.status(201).send({ message: "Registered Successfully" })
          )
          .catch((err) => {
            console.error("Error in Save:", err);
            res.status(500).send({ error: " Error in Save" });
          });
      }
    }
  });
};

// Login User
module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        // User does not exist
        if (result === null) {
          return res.status(404).send({ error: "No Email Found" });
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password
          );
          if (isPasswordCorrect) {
            return res.status(200).send({
              access: auth.createAccessToken(result),
            });
          } else {
            return res
              .status(401)
              .send({ error: "Email and password do not match" });
          }
        }
      })
      .catch((err) => {
        console.error("Error in find:", err);
        res.status(500).send({ error: "Error in find" });
      });
  } else {
    res.status(400).send({ error: `Invalid Email` });
  }
};

// Rertrieve User Profile
module.exports.getProfile = (req, res) => {
  try {
    return User.findById(req.user.id)
      .then((user) => {
        if (user.id) {
          user.password = "";
          return res.status(200).send({ user });
        } else {
          return res.status(404).send({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
        res.status(500).send({ error: "Failed to fetch user profile" });
      });
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    res.status(500).send({ error: "Failed to fetch user profile" });
  }
};

module.exports.getSpecificProfile = (req, res) => {
  return User.findOne({ _id: req.body.userId })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.error("Failed to fetch all users profile:", err);
      res.status(500).send({ error: "Failed to fetch all users profile" });
    });
};

// Update User as Admin
module.exports.updateAdmin = async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId);
    // console.log(profile);
    if (profile.isAdmin === false) {
      profile.isAdmin = true;
      profile.save();
      return res
        .status(200)
        .send({ message: "User updated as admin successfully" });
    } else {
      return res.status(400).send({
        error: "Update to admin Failed - User already in admin status",
      });
    }
  } catch (error) {
    console.error({ error: "Updating of Profile failed:", error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Password
module.exports.updatePassword = async (req, res) => {
  try {
    // console.log(req.body);
    const { newPassword } = req.body;
    const { id } = req.user;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
