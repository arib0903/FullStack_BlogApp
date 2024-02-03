import { generateUploadURL } from "../utils.js";

export const generateUploadURLController = async (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadUrl: url }))
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};
