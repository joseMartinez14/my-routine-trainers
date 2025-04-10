import { get_overview_stats } from './service';

export async function GET(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data_to_return = await get_overview_stats(trainer_id);
    return Response.json(data_to_return);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
