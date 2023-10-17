import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FC, useState } from 'react';

import { GithubRepoType } from '../../helpers/types';
import RepoCard from './RepoCard';

import styles from './ListSavedRepos.module.scss';

export const useRepoData = (sort: string) => {
    return useQuery<GithubRepoType[], unknown, GithubRepoType[], string[]>({
        queryKey: ['saved_repos', sort],
        queryFn: async () => {
            const result = await axios.get('/api/reposerver', {
                params: { sort },
            });
            return result.data as GithubRepoType[];
        },
    });
};

const ListSavedRepos: FC = () => {
    const [sort, setSort] = useState<string>('default');

    const { data } = useRepoData(sort);

    const handleChange = (event: SelectChangeEvent) => {
        setSort(event.target.value);
    };

    const repos = data?.map((repo) => {
        return <RepoCard key={repo?.id} repo={repo} />;
    });

    return (
        <div className={styles.listContainer}>
            {repos && repos?.length > 0 ? (
                <>
                    <div className={styles.sortContainer}>
                        <FormControl sx={{ width: 200 }}>
                            <InputLabel id="sort-by-select-label">
                                Sort
                            </InputLabel>
                            <Select
                                labelId="sort-by-select-label"
                                id="sort-by-select"
                                value={sort}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={'default'}>Default</MenuItem>
                                <MenuItem value={'starsdsc'}>
                                    Stars: High - Low
                                </MenuItem>
                                <MenuItem value={'starsasc'}>
                                    Stars: Low - High
                                </MenuItem>
                                <MenuItem value={'datedsc'}>
                                    Date: New - Old
                                </MenuItem>
                                <MenuItem value={'dateasc'}>
                                    Date: Old - New
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.reposContainer}>{repos}</div>
                </>
            ) : (
                <p className={styles.emptyList}>
                    Search your starred repos above and click an option to add
                    to the list
                </p>
            )}
        </div>
    );
};

export default ListSavedRepos;
