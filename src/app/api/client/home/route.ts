import { get_home_routine } from './service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainer_id = searchParams.get('trainer_id');
    const client_id = Number(searchParams.get('client_id'));

    if (!trainer_id || isNaN(client_id)) {
      return Response.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    const data = await get_home_routine(client_id, trainer_id);
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
