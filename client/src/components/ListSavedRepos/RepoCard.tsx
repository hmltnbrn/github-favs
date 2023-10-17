import DeleteIcon from '@mui/icons-material/Delete';
import Star from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { FC, useState } from 'react';

import { GithubRepoType } from '../../helpers/types';
import AlertSnackbar from '../AlertSnackbar/AlertSnackbar';

import styles from './RepoCard.module.scss';

type ErrorResponse = {
    response: {
        data: string;
    };
};

type Props = {
    repo: GithubRepoType | null;
};

const RepoCard: FC<Props> = ({ repo }) => {
    const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const mutation = useMutation<AxiosResponse, ErrorResponse, string, unknown>(
        {
            mutationFn: (id: string) => {
                return axios.delete(`/api/reposerver/${id}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['saved_repos'] });
            },
            onError: (error: ErrorResponse) => {
                setErrorSnackbar(error.response?.data || 'Unknown error');
            },
        },
    );

    return (
        <div className={styles.repoContainer}>
            <Card sx={{ width: '100%', maxWidth: 350 }} className={styles.card}>
                <CardContent>
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                        className={styles.starContainer}
                    >
                        <Star />
                        {repo?.stargazersCount.toLocaleString()}
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        className={styles.fullName}
                    >
                        <a href={repo?.url} target="_blank" role="link">
                            {repo?.fullName}
                        </a>
                    </Typography>
                    <Typography
                        sx={{ mb: 1.5, fontSize: 12 }}
                        color="text.secondary"
                    >
                        {new Date(repo?.createdAt || '').toDateString()}
                    </Typography>
                    <Typography variant="body1">{repo?.language}</Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        onClick={() => {
                            if (repo?.id) {
                                mutation.mutate(repo.id);
                            }
                        }}
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete From Stored Repos
                    </Button>
                </CardActions>
            </Card>
            <AlertSnackbar
                severity="error"
                isOpen={!!errorSnackbar}
                message={errorSnackbar}
                handleClose={() => setErrorSnackbar(null)}
            />
        </div>
    );
};

export default RepoCard;
