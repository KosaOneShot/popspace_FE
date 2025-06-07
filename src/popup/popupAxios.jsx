// src/api/popup.js
import axi from '../utils/axios/Axios';

export async function updatePopupLike(popupId, currentLiked) {
  const response = await axi.post("/popup/detail/like-update");
  return response.data && typeof response.data.isLiked === "boolean";
}