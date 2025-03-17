import { create_new_client, get_trainer_clients } from './service';

export async function GET(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const clients = await get_trainer_clients(trainer_id);
    return Response.json(clients);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.json();
    return await create_new_client(trainer_id, {
      name: data.name,
      phone: data.phone,
      anatomy: data.anatomy,
      injuries: data.injuries,
      objective: data.objective,
      experience: data.experience,
      weeklyTrainingDays: data.weeklyTrainingDays,
      trainingMinutes: data.trainingMinutes,
    });
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
