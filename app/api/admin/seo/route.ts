import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/mysql-db';

export async function GET() {
  try {
    const connection = getConnection();
    const [rows] = await connection.execute('SELECT id, page, title, description, keywords, robots FROM seo_settings ORDER BY page');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('SEO GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, title, description, keywords, robots } = body;
    const connection = getConnection();
    await connection.execute(
      'INSERT INTO seo_settings (page, title, description, keywords, robots, priority, last_modified) VALUES (?, ?, ?, ?, ?, 0.5, NOW())',
      [page, title, description, keywords, robots]
    );
    return NextResponse.json({ message: 'SEO setting added' });
  } catch (error) {
    console.error('SEO POST error:', error);
    return NextResponse.json({ error: 'Failed to add SEO setting' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, page, title, description, keywords, robots } = body;
    const connection = getConnection();
    await connection.execute(
      'UPDATE seo_settings SET page = ?, title = ?, description = ?, keywords = ?, robots = ?, last_modified = NOW() WHERE id = ?',
      [page, title, description, keywords, robots, id]
    );
    return NextResponse.json({ message: 'SEO setting updated' });
  } catch (error) {
    console.error('SEO PUT error:', error);
    return NextResponse.json({ error: 'Failed to update SEO setting' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    const connection = getConnection();
    await connection.execute('DELETE FROM seo_settings WHERE id = ?', [id]);
    return NextResponse.json({ message: 'SEO setting deleted' });
  } catch (error) {
    console.error('SEO DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete SEO setting' }, { status: 500 });
  }
}