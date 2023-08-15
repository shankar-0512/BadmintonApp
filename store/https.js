import axios from "axios";

const url = "http://10.126.197.37:8000/app/";

export async function login(userName, password) {
  const requestBody = { userName: userName, password: password };
  const response = await axios.post(url + "login/", requestBody);

  return response.data;
}

export async function signup(userName, password) {
  const requestBody = { userName: userName, password: password };
  const response = await axios.post(url + "signup/", requestBody);

  return response.data;
}

export async function fetchActivePlayers() {
  const response = await axios.get(url + "fetchActivePlayers/");

  return response.data;
}

export async function addToPool(userName) {
  const requestBody = { userName: userName };
  const response = await axios.post(url + "addToPool/", requestBody);
  return response.data;
}

export async function removeFromPool(userName) {
  const requestBody = { userName: userName };
  const response = await axios.post(url + "removeFromPool/", requestBody);
  return response.data;
}

export async function generatePairing() {
  const response = await axios.get(url + "generatePairing/");

  return response.data;
}

export async function updateElo(request) {
  const requestBody = { teamDetails: request };
  const response = await axios.post(url + "updateElo/", requestBody);
  return response.data;
}

export async function getCourtStatus(request) {
  const response = await axios.post(url + "getCourtStatus/");
  return response.data;
}
