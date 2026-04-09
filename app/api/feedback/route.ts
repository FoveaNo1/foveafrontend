import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const isDevelopmentMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = isDevelopmentMode ? null : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FeedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  contact: z.string().max(200).nullable().optional(),
  locale: z.enum(['en', 'zh']).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = FeedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { type, title, description, contact, locale } = result.data;

    // 自动收集的上下文（与 subscribe/route.ts 保持一致风格）
    const country = request.headers.get('x-vercel-ip-country') || null;
    const userAgent = request.headers.get('user-agent') || null;

    if (isDevelopmentMode) {
      console.log('[Dev Mode] Feedback submitted:', {
        type, title, description, contact, locale, country, user_agent: userAgent,
      });
      return NextResponse.json({ message: 'Success (Development Mode)' }, { status: 200 });
    }

    const { error: insertError } = await supabase!
      .from('feedback')
      .insert([{
        type,
        title,
        description,
        contact: contact || null,
        locale: locale || null,
        country,
        user_agent: userAgent,
      }]);

    if (insertError) throw insertError;

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json({ error: 'System error, please try again.' }, { status: 500 });
  }
}
