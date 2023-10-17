import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RepoCard from '../RepoCard';

const repo = {
    id: '15452919',
    fullName: 'ethereum/go-ethereum',
    createdAt: '2013-12-26T13:05:46Z',
    stargazersCount: '26012',
    language: 'Go',
    url: 'https://api.github.com/repos/ethereum/go-ethereum',
};

test('renders card', () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <RepoCard repo={repo} />
        </QueryClientProvider>,
    );
    expect(screen.getByRole('link')).toHaveTextContent('ethereum/go-ethereum');
});
