import config from '../../../config';

export default async function handler(req, res) {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${config.newsAPIKey}&pageSize=30`, {
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
      sourceLink:news.url,
      video: false,
      time: (news?.publishedAt?(new Date(news?.publishedAt)).toLocaleDateString():'')
    }
  });
  res.status(200).json({ data })
}