const express = require('express');
const axios = require('axios');

const router = express.Router();

const sortRepos = (data, sortBy) => {
    if (sortBy === 'starsasc') {
        return data.sort((a, b) => {
            return a.stargazersCount - b.stargazersCount;
        });
    } else if (sortBy === 'starsdsc') {
        return data.sort((a, b) => {
            return b.stargazersCount - a.stargazersCount;
        });
    } else if (sortBy === 'dateasc') {
        return data.sort((a, b) => {
            return a.createdAt < b.createdAt
                ? -1
                : a.createdAt > b.createdAt
                ? 1
                : 0;
        });
    } else if (sortBy === 'datedsc') {
        return data.sort((a, b) => {
            return a.createdAt > b.createdAt
                ? -1
                : a.createdAt < b.createdAt
                ? 1
                : 0;
        });
    }
    return data;
};

router.get('/', async (req, res) => {
    try {
        const { sort } = req.query;
        const result = await axios.get('http://reposerver:8080/repo/');
        const data = sortRepos(result.data.repos, sort);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(400).json('There was an error');
    }
});

router.post('/', async (req, res) => {
    const { repo } = req.body;
    const result = await axios.get('http://reposerver:8080/repo/');
    const { repos } = result.data;
    if (repos.length < 10) {
        try {
            const { data } = await axios.post(
                'http://reposerver:8080/repo/',
                repo,
                {
                    headers: {
                        'content-type': 'application/json',
                    },
                },
            );
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 409) {
                    return res.status(409).json('Repo already added');
                }
            }
            return res.status(400).json('There was an error');
        }
    } else {
        return res.status(409).json('Cannot have more than 10 saved repos');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await axios.delete(`http://reposerver:8080/repo/${id}`);
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.status(400).json('There was an error');
    }
});

module.exports = router;
