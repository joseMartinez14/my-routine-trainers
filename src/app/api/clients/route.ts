export async function POST(req: Request) {
  console.log('En el post');
  console.log(req.headers.get('Trainer-Name'));
  console.log(req.headers.get('Trainer-ID'));
  return Response.json({ onClientpost: 'picha' });
}
