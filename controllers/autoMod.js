const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.NSFW_MODEL, req.body.url)
    .then(data => {
      res.json(data);
    })
    .catch(err =>
      res.status(400).json("Something went wrong with Clarifai API")
    );
};

module.exports = {
  handleApiCall
};
