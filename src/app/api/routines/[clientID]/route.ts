import { get_client_routines } from '../service';

export async function GET(request: Request, { params }: { params: { clientID: string } }) {
  try {
    const trainer_id = request.headers.get('Trainer-ID') || '';
    const exerciseID = params.clientID;
    const data_to_send = await get_client_routines(trainer_id, Number(exerciseID));
    return Response.json(data_to_send);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
