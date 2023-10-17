import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SearchStarredRepos from '../SearchStarredRepos';

test('displays search bar', () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <SearchStarredRepos />
        </QueryClientProvider>,
    );
    expect(screen.getByLabelText('Search Your Starred Repos'));
});
