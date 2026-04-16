import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IBlog } from '../../../interface/blog.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/esm/Spinner';

interface IProps {
    isOpenDeleteModal: boolean;
    setIsOpenDeleteModal: (isOpen: boolean) => void;
    dataBlog: IBlog;
}

const BlogDeleteModal = (props: IProps) => {
    const { dataBlog, isOpenDeleteModal, setIsOpenDeleteModal } = props;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: IBlog) => {
            const res = await fetch(`http://localhost:8000/blogs/${payload.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": " application/json"
                }
            });
            return res.json();
        },
        onSuccess: () => {
            // data, variables, context
            toast('🦄 Wow so easy! Delete succeed');
            setIsOpenDeleteModal(false);
            queryClient.invalidateQueries({ queryKey: ['fetchBlogs'] });
        }
    })

    const handleSubmit = () => {
        if (dataBlog?.id) {
            mutation.mutate({ id: dataBlog.id, title: dataBlog.title, author: dataBlog.author, content: dataBlog.content });
        }
    }

    return (
        <Modal
            show={isOpenDeleteModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop={false}
            onHide={() => setIsOpenDeleteModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete A Blog
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Delete the blog: {dataBlog?.title ?? ""}
            </Modal.Body>
            <Modal.Footer>
                {!mutation.isPending ? (
                    <>
                        <Button
                            variant='warning'
                            onClick={() => setIsOpenDeleteModal(false)} className='mr-2'>Cancel</Button>
                        <Button onClick={() => handleSubmit()}>Confirm</Button>
                    </>
                ) :
                    (
                        <Button variant="primary" disabled>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <></> Deleting...
                        </Button>
                    )}
            </Modal.Footer>
        </Modal>
    )
}

export default BlogDeleteModal;