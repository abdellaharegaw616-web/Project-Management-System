const Resource = require('../models/Resource');

const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user._id });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const { name, type, capacity, skills, department, hourlyRate } = req.body;
    
    const resource = await Resource.create({
      name,
      type: type || 'human',
      capacity: capacity || 40,
      allocated: 0,
      available: capacity || 40,
      skills: skills || [],
      utilization: 0,
      department: department || '',
      hourlyRate: hourlyRate || 0,
      user: req.user._id
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  createResource,
  updateResource,
  deleteResource
};
