import { create_new_routine, get_trainer_routines } from './service';

export async function POST(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.json();
    return await create_new_routine(
      trainer_id,
      data.client_id,
      data.routine_name,
      data.routine_comment,
      data.exerciseRoutineMap
    );
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const ret_data = await get_trainer_routines(trainer_id);
    return Response.json(ret_data);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
