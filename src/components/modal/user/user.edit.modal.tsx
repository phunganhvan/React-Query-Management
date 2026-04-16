import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from 'react-bootstrap/esm/Spinner';

interface IUser {
    id: string;
    email: string;
    name: string;
}

interface IProps {
    isOpenUpdateModal: boolean;
    setIsOpenUpdateModal: (isOpen: boolean) => void;
    dataUser: IUser ;
}
const UserEditModal = (props: IProps) => {
    const queryClient = useQueryClient();

    const { isOpenUpdateModal, setIsOpenUpdateModal, dataUser } = props;
    const [id, setId] = useState<string | null>(null);

    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");

    const mutation = useMutation({
        mutationFn: async (payload: IUser) => {
            const res = await fetch(`http://localhost:8000/users/${payload.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    email: payload.email,
                    name: payload.name,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            return res.json();
        },
        onSuccess: () => {
            // data, variables, context
            toast('🦄 Wow so easy! Update succeed');
            setIsOpenUpdateModal(false);
            setEmail("");
            setName("");
            queryClient.invalidateQueries({ queryKey: ['fetchUsers'] });
        }
    })

    useEffect(() => {
        if (dataUser?.id) {
            setId(dataUser?.id);
            setEmail(dataUser?.email);
            setName(dataUser?.name)
        }
    }, [dataUser])


    const handleSubmit = () => {
        if (!email) {
            alert("email empty");
            return;
        }
        if (!name) {
            alert("name empty");
            return;
        }
        if (id) {
            mutation.mutate({ email, name, id: id as string });
        }
    }

    return (
        <>
            <Modal
                show={isOpenUpdateModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={false}
                onHide={() => setIsOpenUpdateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update A User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel
                        label="Email"
                        className="mb-3"
                    >
                        <Form.Control
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Name">
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    {!mutation.isPending ? (
                        <>
                            <Button
                                variant='warning'
                                onClick={() => setIsOpenUpdateModal(false)} className='mr-2'>Cancel</Button>
                            <Button onClick={() => handleSubmit()}>Confirm</Button>
                        </>
                    ) : (
                        <Button variant="primary" disabled>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <></> Updating...
                        </Button>

                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserEditModal;