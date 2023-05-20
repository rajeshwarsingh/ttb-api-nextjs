export default async function handler(req, res) {

  let newsPromises = [
    fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=6c08c057e51646d4b3c14313b53b05ce&pageSize=5'),
    fetch('https://newsapi.org/v2/top-headlines?category=health&apiKey=6c08c057e51646d4b3c14313b53b05ce&pageSize=5'),
    fetch('https://newsapi.org/v2/top-headlines?category=entertainment&apiKey=6c08c057e51646d4b3c14313b53b05ce&pageSize=5'),
    fetch('https://newsapi.org/v2/top-headlines?category=technology&apiKey=6c08c057e51646d4b3c14313b53b05ce&pageSize=5'),
    fetch('https://newsapi.org/v2/top-headlines?category=business&apiKey=6c08c057e51646d4b3c14313b53b05ce&pageSize=5')
  ];

  let promiseData = await Promise.all(newsPromises);

  const data = {
    breaking: (await promiseData[0].json())['articles'],
    health: (await promiseData[1].json())['articles'],
    entertainment: (await promiseData[2].json())['articles'],
    technology: (await promiseData[3].json())['articles'],
    business: (await promiseData[4].json())['articles'],
  }

  res.status(200).json({ data });
}