import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).send("user was not found");
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid credentials" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).send({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
/*export const signUp = async (req, res) => {
  const { email, password, firstName, LastName, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json({ message: "user already exists" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password doesn't match" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      firstName,
      LastName,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);
    res.status(200).send({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};*/
export const signUp = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword)
      return res.status(404).json({ message: "password doesn't match" });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password: hash,
      confirmPassword: hash,
    });

    await newUser.save();
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);
    res.status(200).send({ result: newUser, token });
  } catch (err) {
    return res.status(400).json("error");
  }
};
