'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SeoSetting {
  id: number;
  page: string;
  title: string;
  description: string;
  keywords: string;
  robots: string;
}

export default function SeoPage() {
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SeoSetting | null>(null);
  const [formData, setFormData] = useState({ page: '', title: '', description: '', keywords: '', robots: 'index,follow' });
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [robotsContent, setRobotsContent] = useState('');

  // Fetch SEO settings
  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    const res = await fetch('/api/admin/seo');
    if (res.ok) {
      const data = await res.json();
      setSeoSettings(data);
    }
  };

  // Handle form submit (add/edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSetting ? 'PUT' : 'POST';
    const body = editingSetting ? { ...formData, id: editingSetting.id } : formData;

    const res = await fetch('/api/admin/seo', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      fetchSeoSettings();
      setIsModalOpen(false);
      setEditingSetting(null);
      setFormData({ page: '', title: '', description: '', keywords: '', robots: 'index,follow' });
    }
  };

  // Delete setting
  const handleDelete = async (id: number) => {
    if (confirm('Delete this SEO setting?')) {
      const res = await fetch('/api/admin/seo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchSeoSettings();
    }
  };

  // Generate Sitemap
  const generateSitemap = async () => {
    const res = await fetch('/api/sitemap.xml');
    if (res.ok) {
      const url = `${window.location.origin}/sitemap.xml`;
      setSitemapUrl(url);
      alert('Sitemap generated! URL: ' + url);
    }
  };

  // Edit Robots.txt
  const updateRobots = async () => {
    const res = await fetch('/api/robots.txt', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: robotsContent,
    });
    if (res.ok) alert('Robots.txt updated!');
  };

  // Fetch current robots.txt
  useEffect(() => {
    fetch('/api/robots.txt').then(res => res.text()).then(setRobotsContent);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SEO Management</h1>

      {/* Buttons */}
      <div className="mb-4 space-x-2">
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Add SEO Setting</button>
        <button onClick={generateSitemap} className="bg-green-500 text-white px-4 py-2 rounded">Generate Sitemap</button>
        <Link href="/admin" className="bg-gray-500 text-white px-4 py-2 rounded">Back to Admin</Link>
      </div>

      {/* Sitemap URL */}
      {sitemapUrl && <p className="mb-4">Sitemap URL: <a href={sitemapUrl} target="_blank" className="text-blue-600">{sitemapUrl}</a></p>}

      {/* Robots.txt Editor */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Robots.txt</h2>
        <textarea
          value={robotsContent}
          onChange={(e) => setRobotsContent(e.target.value)}
          className="w-full h-32 border p-2"
          placeholder="User-agent: *&#10;Disallow: /admin/"
        />
        <button onClick={updateRobots} className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">Update Robots.txt</button>
      </div>

      {/* SEO Settings Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Page</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Keywords</th>
            <th className="border p-2">Robots</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {seoSettings.map((setting) => (
            <tr key={setting.id}>
              <td className="border p-2">{setting.page}</td>
              <td className="border p-2">{setting.title}</td>
              <td className="border p-2">{setting.description}</td>
              <td className="border p-2">{setting.keywords}</td>
              <td className="border p-2">{setting.robots}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => { setEditingSetting(setting); setFormData(setting); setIsModalOpen(true); }} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(setting.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">{editingSetting ? 'Edit' : 'Add'} SEO Setting</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Page (e.g., /)" value={formData.page} onChange={(e) => setFormData({ ...formData, page: e.target.value })} className="w-full mb-2 p-2 border" required />
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full mb-2 p-2 border" required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full mb-2 p-2 border" required />
              <input type="text" placeholder="Keywords" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} className="w-full mb-2 p-2 border" />
              <input type="text" placeholder="Robots" value={formData.robots} onChange={(e) => setFormData({ ...formData, robots: e.target.value })} className="w-full mb-2 p-2 border" />
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}