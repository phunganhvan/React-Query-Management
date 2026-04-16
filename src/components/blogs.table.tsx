
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import BlogCreateModal from './modal/blog.create.modal';
import BlogEditModal from './modal/blog.edit.modal';
import BlogDeleteModal from './modal/blog.delete.modal';
import { calculatePagesCount } from '../helper';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import BlogsPagination from './pagination/blogs.pagination';

interface IBlog {
    id: string;
    title: string;
    author: string;
    content: string;
}

function BlogsTable() {


    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [dataBlog, setDataBlog] = useState({});

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const PAGE_SIZE = 2;

    const {isPending, error, data} = useQuery({
        queryKey: ['fetchBlogs', currentPage],
        queryFn: (): Promise<IBlog[]> =>
            fetch(`http://localhost:8000/blogs?_page=${currentPage}&_limit=${PAGE_SIZE}`).then((res) =>
            {
                const totalItems = res.headers?.get('X-Total-Count') ?? 0;
                if (totalItems) {
                    setTotalPages(calculatePagesCount(PAGE_SIZE, Number(totalItems)));
                }
                return res.json();
            }
            ),
            placeholderData: keepPreviousData,
    })

    const handleEditBlog = (blog: IBlog) => {
        setDataBlog(blog);
        setIsOpenUpdateModal(true);
    }
    const handleDelete = (blog: IBlog) => {
        setDataBlog(blog);
        setIsOpenDeleteModal(true);
    }
    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0" }}>
                <h4>Table Blogs</h4>
                <Button variant="primary"
                    onClick={() => setIsOpenCreateModal(true)}
                >Add New</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((blog: IBlog) => {
                        return (
                            <tr key={blog.id}>
                                <td>{blog.id}</td>
                                <td>{blog.title}</td>
                                <td>{blog.author}</td>
                                <td>{blog.content}</td>

                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditBlog(blog)}
                                        className='mb-3'
                                    >
                                        Edit
                                    </Button>&nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(blog)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <BlogsPagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <BlogCreateModal
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
            />

            <BlogEditModal
                isOpenUpdateModal={isOpenUpdateModal}
                setIsOpenUpdateModal={setIsOpenUpdateModal}
                dataBlog={dataBlog}
            />

            <BlogDeleteModal
                dataBlog={dataBlog}
                isOpenDeleteModal={isOpenDeleteModal}
                setIsOpenDeleteModal={setIsOpenDeleteModal}
            />
        </>
    );
}

export default BlogsTable;