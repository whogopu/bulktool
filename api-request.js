/* Modules */
import axios from 'axios';

/* API Parameters */
const endpoint =
  'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed'; // Endpoint
const key = 'AIzaSyDlqYhjKUA8He1lYFzI8EQ3wToAxRb8VWM'; // API Key (https://developers.google.com/speed/docs/insights/v5/get-started)

// Custom function to request PageSpeed API
export const apiRequest = async (url, device, chunkIndex, chunkItemIndex, round, totalChunk, totalItem, totalRound) => {
  console.log(`calling at: ${new Date().toLocaleTimeString()} chunkIndex=${chunkIndex}/${totalChunk} | chunkItemIndex=${chunkItemIndex}/${totalItem} | round=${round}/${totalRound} | url=${url}`)
  const { data } = await axios(`${endpoint}?url=${encodeURIComponent(url)}`, {
    params: {
      strategy: device,
      key: key,
    },
  });
  return data;
};
