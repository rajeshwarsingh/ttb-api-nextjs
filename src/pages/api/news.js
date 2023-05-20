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
    breaking: formatData(await promiseData[0].json()),
    health: formatData(await promiseData[1].json()),
    entertainment: formatData(await promiseData[2].json()),
    technology: formatData(await promiseData[3].json()),
    business: formatData(await promiseData[4].json()),
  }

  res.status(200).json({ data });
}

function formatData(data) {
  const resData = (data?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      description: news.title,
      image: news.urlToImage,
      logo: news.urlToImage,
      sourceLink:news.url,
      video: false,
    }
  });

  return resData;
}