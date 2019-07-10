const handleUploadImage = (req, res, cloudinary) => {
  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path));
  Promise.all(promises).then(results => res.json(results));
};

module.exports = {
  handleUploadImage
};
