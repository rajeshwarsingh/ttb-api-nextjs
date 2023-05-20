export default async function handler(req, res) {
  const apiRes = await fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=6c08c057e51646d4b3c14313b53b05ce&pageSize=30', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      description: news.title,
      image: news.urlToImage,
      logo: news.urlToImage,
      video: false,
      time: (news?.publishedAt?(new Date(news?.publishedAt)).toLocaleDateString():'')
    }
  });
  res.status(200).json({ data })
}