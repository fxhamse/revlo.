// app/api/auth/logout/route.ts - User Logout API Route
import { NextResponse } from 'next/server';
// import { signOut } from 'next-auth/react'; // Mustaqbalka, haddii aad isticmaalayso NextAuth.js client-side
// import { getServerSession } from 'next-auth'; // Mustaqbalka, haddii aad isticmaalayso NextAuth.js server-side
// import { authOptions } from '@/lib/auth'; // Soo dhoof authOptions

export async function POST(request: Request) {
  try {
    // Mustaqbalka, halkan waxaad ku maamuli doontaa session-ka user-ka.
    // Haddii aad isticmaalayso NextAuth.js, waxaad u baahan doontaa inaad isticmaasho signOut function.

    // Tusaale (NextAuth.js server-side):
    // const session = await getServerSession(authOptions);
    // if (session) {
    //   // Halkan waxaad ku samayn kartaa waxyaabo dheeraad ah ka hor inta aanu user-ku bixin
    //   // tusaale, diiwaan gasho log-out activity
    //   await signOut({ redirect: false, callbackUrl: '/' }); // Ha u gudbin bog kale, kaliya session-ka dami
    // }

    // Hadda, waxaan soo celinaynaa jawaab guul ah oo fudud
    return NextResponse.json(
      { message: 'Si guul leh ayaad uga baxday!' },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error('Cilad ayaa dhacday marka user-ka la saarayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
