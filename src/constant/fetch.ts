import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IUser } from '../interface/user.interface';
import { QUERY_KEY } from './key';
import { calculatePagesCount } from '../helper';
const PAGE_SIZE = 2;
export const useFetchUsers = (currentPage: number) => {
    const queryInfo = useQuery({
        queryKey: QUERY_KEY.getUserPaginate(currentPage),
        queryFn: async (): Promise<any> =>
            fetch(`http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`).then(
                async (res) => {
                    const totalItems = res.headers?.get('X-Total-Count') ?? 0;
                    const totalPages = calculatePagesCount(PAGE_SIZE, Number(totalItems));

                    const d = await res.json();
                    return {
                        totalItems: Number(totalItems),
                        totalPages,
                        users: d
                    };
                },
            ),
        placeholderData: keepPreviousData,
    });
    return {
        ...queryInfo,
        data: queryInfo?.data?.users ?? [],
        count: queryInfo?.data?.totalItems ?? 0,
        totalPages: queryInfo?.data?.totalPages ?? 0,
    }
}