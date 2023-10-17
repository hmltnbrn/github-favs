import Star from '@mui/icons-material/Star';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { debounce } from '@mui/material/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import {
    FC,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { GithubRepoType } from '../../helpers/types';
import AlertSnackbar from '../AlertSnackbar/AlertSnackbar';

import styles from './SearchStarredRepos.module.scss';

type ErrorResponse = {
    response: {
        data: string;
    };
};

const SearchStarredRepos: FC = () => {
    const [value, setValue] = useState<GithubRepoType | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<readonly GithubRepoType[]>([]);
    const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchInput = useRef<HTMLInputElement | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation<
        AxiosResponse,
        ErrorResponse,
        GithubRepoType,
        unknown
    >({
        mutationFn: (repo: GithubRepoType) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { description, ...rest } = repo;
            return axios.post('/api/reposerver', {
                repo: rest,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved_repos'] });
        },
        onSettled: () => {
            setValue(null);
            if (searchInput) {
                searchInput?.current?.blur();
            }
        },
        onError: (error: ErrorResponse) => {
            setErrorSnackbar(error.response?.data || 'Unknown error');
        },
    });

    const fetch = useMemo(
        () =>
            debounce(
                async (
                    request: { input: string },
                    callback: (results?: readonly GithubRepoType[]) => void,
                ) => {
                    setIsLoading(true);
                    try {
                        const res = await axios.get('/api/github/starred', {
                            params: { q: request.input },
                        });
                        const data = res.data as GithubRepoType[];
                        callback(data);
                    } catch (error) {
                        setErrorSnackbar('Unknown error');
                    }
                },
                300,
            ),
        [],
    );

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            setIsLoading(false);
            return undefined;
        }

        fetch({ input: inputValue }, (results?: readonly GithubRepoType[]) => {
            if (active) {
                let newOptions: readonly GithubRepoType[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
            setIsLoading(false);
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <div className={styles.searchContainer}>
            <Autocomplete
                id="search-starred-repos"
                sx={{ maxWidth: 600 }}
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.fullName
                }
                fullWidth
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                loading={isLoading}
                noOptionsText={
                    inputValue ? 'No repos found' : 'Begin typing to find repos'
                }
                onChange={(
                    event: SyntheticEvent,
                    newValue: GithubRepoType | null,
                ) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    if (newValue) {
                        mutation.mutate(newValue);
                    }
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Your Starred Repos"
                        fullWidth
                        inputRef={searchInput}
                    />
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <div className={styles.optionContainer}>
                                <div className={styles.starContainer}>
                                    <Star />
                                    {option.stargazersCount.toLocaleString()}
                                </div>
                                <div className={styles.infoContainer}>
                                    <h3>{option.fullName}</h3>
                                    <p className={styles.description}>
                                        {option.description}
                                    </p>
                                    <p className={styles.language}>
                                        {option.language}
                                    </p>
                                </div>
                            </div>
                        </li>
                    );
                }}
            />
            <AlertSnackbar
                severity="error"
                isOpen={!!errorSnackbar}
                message={errorSnackbar}
                handleClose={() => setErrorSnackbar(null)}
            />
        </div>
    );
};

export default SearchStarredRepos;
