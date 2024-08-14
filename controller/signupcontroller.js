
var Form = require("../model/signupmodel")
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')

exports.createform = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const mail = await Form.findOne({ email: email });
    if (mail) {
      res.status(400).json({ error: 'Email is already registered' });
    } else {
      const form = await Form.create({
        name,
        email,
        phone,
        password,
      });
      const savedform = await form.save();
      res.status(200).json(savedform);
    }

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the form' });
  }
};

exports.loginform = async (req, res) => {
  const { email, password } = req.body;
  try {
    const form = await Form.findOne({ email: email });
    if (!form) {
      res.status(400).json({ error: 'Enter Registered Email' });
      return;
    }
    const isMatch = await bcrypt.compare(password, form.password);

    const token = jwt.sign({ email: form.email }, 'myjwtsecretkey');

    const profile = {
      id: form._id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      image: form.image,
      token: token,
    }
    

    if (isMatch) {
      return res.status(200).json({ message: 'Login Successful', form: profile , token: token});
    } else {
      return res.status(401).json({ error: 'Invalid Password' });
    }

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
};

exports.getformbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const savedform = await Form.findById(id);
    res.status(200).json(savedform);

  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateform = async (req, res) => {
  const { id } = req.params;
  const { name, address, address1, country, state, zip, phone, email } = req.body;

  const imageFilePath = req.file ? req.file.filename : undefined;
  try {
    const savedform = await Form.findByIdAndUpdate(
      id, {
        name,
      address,
      address1,
      image:imageFilePath,
      country,
      state,
      zip,
      phone,
      email
    }, { new: true });
    if (!savedform) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json(savedform);

  } catch (error) {
    res.status(500).json({ error });
  }
};


exports.deleteuser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedform = await Form.findByIdAndDelete(id);
    if (!deletedform) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(deletedform);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the Profile' });
  }
};