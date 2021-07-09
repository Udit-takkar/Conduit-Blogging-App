import axios from "../config/api.config";

export const getTags = async () => {
  try {
    const res = await axios.get("/tags", {
      headers: {
        accepts: "application/json",
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
    return err.response;
  }
};
