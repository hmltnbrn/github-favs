import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import * as React from 'react';

export const handlers = [
    rest.get('*/api/reposerver', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    id: '15452919',
                    fullName: 'ethereum/go-ethereum',
                    createdAt: '2013-12-26T13:05:46Z',
                    stargazersCount: '26012',
                    language: 'Go',
                    url: 'https://api.github.com/repos/ethereum/go-ethereum',
                },
            ]),
        );
    }),
];

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
        logger: {
            log: console.log,
            warn: console.warn,
            error: () => {},
        },
    });

export function renderWithClient(ui: React.ReactElement) {
    const testQueryClient = createTestQueryClient();
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>
            {ui}
        </QueryClientProvider>,
    );
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={testQueryClient}>
                    {rerenderUi}
                </QueryClientProvider>,
            ),
    };
}

export function createWrapper() {
    const testQueryClient = createTestQueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={testQueryClient}>
            {children}
        </QueryClientProvider>
    );
}
