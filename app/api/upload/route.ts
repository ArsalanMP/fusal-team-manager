import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Try Supabase first, fallback to local storage
    if (supabase) {
      try {
        const filePath = `player-photos/${fileName}`;
        const fileBuffer = await file.arrayBuffer();

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('player-photos')
          .upload(filePath, fileBuffer, {
            contentType: file.type,
            upsert: false
          });

        if (!error) {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('player-photos')
            .getPublicUrl(filePath);

          return NextResponse.json({
            url: urlData.publicUrl,
            path: filePath
          });
        }
      } catch (supabaseError) {
        console.warn('Supabase upload failed, falling back to local storage:', supabaseError);
      }
    }

    // Fallback to local storage
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, fileName);
    const fileBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      path: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
