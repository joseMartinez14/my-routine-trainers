import { Suspense } from "react";
import EditClientElement from "./editClient";


const EditClient = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <EditClientElement />
            </Suspense>
        </div>
    );
}

export default EditClient