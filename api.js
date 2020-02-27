const superagent = require("superagent");

const API_URL = "https://api.lingualeo.com/";

const agent = superagent.agent();

const api = endpoint => API_URL + endpoint;

const authorize = (email, password) => {
  return agent.post(api("login")).send({ email, password });
};

const getDictionary = (offset = 0) => {
  return agent.get(api("userdict")).query({ offset });
};

module.exports = { authorize, getDictionary };
