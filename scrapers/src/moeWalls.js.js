const axios = require('axios');
const cheerio = require('cheerio');

async function wallpaperMoe(name) {
    try {
        const response = await axios.post(`https://moewalls.com/?s=${name}`, 
            new URLSearchParams({ s: name }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'max-age=0',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'TE': 'Trailers',
                },
            }
        );

        const $ = cheerio.load(response.data);

        const wallpapers = [];
        $('article').each((index, element) => {
            const title = $(element).find('.entry-title a').text().trim();
            const link = $(element).find('.entry-title a').attr('href');
            const imgSrc = $(element).find('img').attr('src');
            const urlLiveWallpaper = $(element).find('.entry-title a').attr('href'); // Menambahkan URL Live Wallpaper

            wallpapers.push({
                title,
                link,
                wallpaper: imgSrc,
                urlLiveWallpaper 
            });
        });

        return {
            wallpapers, 
        };
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
    }
}

module.exports = { wallpaperMoe }