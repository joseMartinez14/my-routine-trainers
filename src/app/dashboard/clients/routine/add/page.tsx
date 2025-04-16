import { Suspense } from "react"
import AddRoutine from "./AddRoutine"

const AddRoutinePage = () => {

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <AddRoutine />
            </Suspense>
        </div>
    )
}

export default AddRoutinePage

