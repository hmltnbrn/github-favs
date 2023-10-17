import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '../../../setupTests';
import { createWrapper } from '../../../tests/utils';
import { useRepoData } from '../ListSavedRepos';

describe('useQuery', () => {
    test('successful query', async () => {
        const { result } = renderHook(() => useRepoData('default'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.[0].fullName).toBe('ethereum/go-ethereum');
    });

    test('failed query', async () => {
        server.use(
            rest.get('*', (req, res, ctx) => {
                return res(ctx.status(500));
            }),
        );

        const { result } = renderHook(() => useRepoData('default'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeDefined();
    });
});
