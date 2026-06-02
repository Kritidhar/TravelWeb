export default async function handler(req, res) {

    const location = req.query.location;

    try {

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${location}&per_page=6&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );

        const data = await response.json();

        res.status(200).json(data);

    } catch(error) {

        res.status(500).json({
            error: "Unable to fetch images"
        });

    }
}
