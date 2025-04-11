import Cors from 'nextjs-cors';

import { check_client_data } from './service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainer_id = searchParams.get('trainer_id');
    const client_id = Number(searchParams.get('client_id'));

    if (!trainer_id || isNaN(client_id)) {
      return Response.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }
    const data_to_return = await check_client_data(trainer_id, client_id);
    return Response.json(data_to_return);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 406 });
  }
}
