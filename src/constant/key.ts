export const QUERY_KEY = {
    getAllUsers : () => ['fetchUsers'],
    getUserPaginate : (page: number)  => { return ['fetchUsers', page]}
}