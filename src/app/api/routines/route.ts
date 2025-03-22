import { create_new_routine } from './service';

export async function POST(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.json();
    return await create_new_routine(trainer_id, data.client_id, data.routine_name, data.exerciseRoutineMap);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
