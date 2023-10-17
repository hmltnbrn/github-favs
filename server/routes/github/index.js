const express = require('express');
const { Octokit } = require('@octokit/rest');

const router = express.Router();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

router.get('/starred', async (req, res) => {
    try {
        const query = req.query.q && req.query.q.toLowerCase().trim();
        const data = await octokit.paginate(
            'GET /users/{user}/starred',
            { user: process.env.GITHUB_USERNAME },
            (response) =>
                response.data.map((repo) => {
                    return {
                        id: repo.id.toString(),
                        fullName: repo.full_name,
                        description: repo.description,
                        createdAt: repo.created_at,
                        stargazersCount: repo.stargazers_count,
                        language: repo.language,
                        url: repo.html_url,
                    };
                }),
        );
        if (query) {
            const filteredData = data.filter((d) => {
                return d.fullName.includes(query);
            });
            return res.json(filteredData);
        }
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(400).json('There was an error');
    }
});

module.exports = router;
