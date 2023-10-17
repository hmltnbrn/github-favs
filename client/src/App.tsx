import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {
    QueryClient,
    QueryClientProvider,
    useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { FC, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Header from './components/Header/Header';
import ListSavedRepos from './components/ListSavedRepos/ListSavedRepos';
import SearchStarredRepos from './components/SearchStarredRepos/SearchStarredRepos';

import styles from './App.module.scss';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
            refetchOnWindowFocus: false,
        },
    },
});

const App: FC = () => {
    const { reset } = useQueryErrorResetBoundary();
    return (
        <div className={styles.appContainer}>
            <Header />
            <div className={styles.homeContainer}>
                <QueryClientProvider client={queryClient}>
                    <ErrorBoundary
                        onReset={reset}
                        fallbackRender={({ resetErrorBoundary }) => (
                            <div>
                                There was an error!
                                <Button onClick={() => resetErrorBoundary()}>
                                    Try again
                                </Button>
                            </div>
                        )}
                    >
                        <Suspense
                            fallback={
                                <Backdrop
                                    sx={{
                                        color: '#fff',
                                        zIndex: (theme) =>
                                            theme.zIndex.drawer + 1,
                                    }}
                                    open
                                >
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            }
                        >
                            <SearchStarredRepos />
                            <ListSavedRepos />
                        </Suspense>
                    </ErrorBoundary>
                </QueryClientProvider>
            </div>
        </div>
    );
};

export default App;
