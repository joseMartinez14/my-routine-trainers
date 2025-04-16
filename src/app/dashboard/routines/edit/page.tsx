import { Suspense } from "react";
import EditRoutine from "./EditRoutine";

const EditRoutinePage = () => {


    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <EditRoutine />
            </Suspense>
        </div>
    );
}

export default EditRoutinePage

