var Data = require("../model/adminmodel")
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')



exports.createdata = async (req, res) => {
  const { name, email, phone, zip, address, image, password } = req.body;
  try {
    const mail = await Data.findOne({ email: email });
    if (mail) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    const data = new Data({
      name,
      email,
      phone,
      zip,
      address,
      image,
      password,
    });
    const savedData = await data.save();
    res.status(200).json(savedData);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while creating the form' });
  }
};


exports.adminloginform = async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await Data.findOne({ email: email });
    if (!data) {
      res.status(400).json({ error: 'Enter Registered Email' });
      return;
    }
    const isMatch = await bcrypt.compare(password, data.password);

    const token = jwt.sign({ email: data.email }, 'myjwtsecretkey');

    const profile = {
      id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      image: data.image,
      token: token,
    }


    if (isMatch) {
      return res.status(200).json({ data: profile, token: token });
    } else {
      return res.status(401).json({ error: 'Invalid Password' });
    }

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
};


exports.getdatabyid = async (req, res) => {
  try {
    const { id } = req.params;
    const saveddata = await Data.findById(id);
    if (!saveddata) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json(saveddata);
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateadmin = async (req, res) => {
  const { id } = req.params;
  const { name, address, address1, country, state, zip, phone, email } = req.body;

  const imageFilePath = req.file ? req.file.filename : undefined;
  try {
    const saveddata = await Data.findByIdAndUpdate(
      id, {
      name,
      address,
      address1,
      image: imageFilePath,
      country,
      state,
      zip,
      phone,
      email
    }, { new: true });
    if (!saveddata) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json(saveddata);

  } catch (error) {
    res.status(500).json({ error });
  }
};


exports.deleteprofile = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deleteddata = await Data.findByIdAndDelete(id);
    if (!deleteddata) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(deleteddata);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the Profile' });
  }
};
