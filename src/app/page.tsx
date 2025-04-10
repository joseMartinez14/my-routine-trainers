
// Server-Side Component or Server Action (e.g., app/old-page/page.js or a server action)
import { redirect } from 'next/navigation';

export default function OldPage() {
  redirect('/home');
}