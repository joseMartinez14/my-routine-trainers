import Modal from '@mui/material/Modal';
import { Hourglass } from 'react-loader-spinner';

interface LoadingModalProps {
    open: boolean;
}

export default function LoadingModal(props: LoadingModalProps) {

    const { open } = props;

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '36%',
                    left: '48%',
                }}
            >
                <Hourglass
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="hourglass-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    colors={['#306cce', '#72a1ed']}
                />
            </Modal>
        </div>
    );
}