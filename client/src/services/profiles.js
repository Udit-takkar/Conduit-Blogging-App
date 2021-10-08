import axios from "../config/api.config";

export const UnFollow = async (username) => {
  try {
    const res = await axios.delete(`/profiles/${username}/follow`);
    return res.data;
  } catch (e) {
    return e.response;
  }
};
export const Follow = async (username) => {
  try {
    const res = await axios.post(`/profiles/${username}/follow`);
    return res.data;
  } catch (e) {
    return e.response;
  }
};

export const CheckFollowing = async (username) => {
  try {
    const res = await axios.get(`/profiles/${username}`);
    return res.data;
  } catch (e) {
    return e.response;
  }
};
