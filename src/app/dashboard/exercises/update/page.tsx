import { Suspense } from "react"
import UpdateExercise from "./ExercisesUpdate"

const UpdateExercisePage = () => {


    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <UpdateExercise />
            </Suspense>
        </div>

    )
}

export default UpdateExercisePage