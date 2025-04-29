import { edit_new_client, get_one_client } from '../service';

export async function GET(request: Request, { params }: { params: { clientID: string } }) {
  try {
    const clientID = params.clientID;
    const trainer_id = request.headers.get('Trainer-ID') || '';

    const client = await get_one_client(trainer_id, clientID);
    return Response.json(client);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { clientID: string } }) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const clientID = params.clientID;
    const data = await req.json();
    return await edit_new_client(trainer_id, {
      id: clientID,
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
