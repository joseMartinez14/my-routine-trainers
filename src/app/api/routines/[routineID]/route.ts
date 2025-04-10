import { get_routine_by_ID, update_routine } from '../service';

export async function GET(request: Request, { params }: { params: { routineID: string } }) {
  try {
    const routineID = params.routineID;
    const data_to_send = await get_routine_by_ID(Number(routineID));
    return Response.json(data_to_send);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    return await update_routine(
      Number(data.routine_id),
      data.routine_name,
      data.routine_comment,
      data.exerciseRoutineMap
    );
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
