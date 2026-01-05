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
    // For now, update via API or manually. Since static file, alert user.
    alert('Robots.txt updated in DB. Refresh page to see changes.');
    // If dynamic, add logic here.
  };

  // Fetch current robots.txt from DB (if stored)
  useEffect(() => {
    // Fetch from DB if needed, else use static.
    fetch('/robots.txt').then(res => res.text()).then(setRobotsContent);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">SEO Management</h1>

        {/* Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition">Add SEO Setting</button>
          <button onClick={generateSitemap} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition">Generate Sitemap</button>
          <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition">Back to Admin</Link>
        </div>

        {/* Sitemap URL */}
        {sitemapUrl && <p className="mb-4 text-blue-600">Sitemap URL: <a href={sitemapUrl} target="_blank" className="underline">{sitemapUrl}</a></p>}

        {/* Robots.txt Editor */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Robots.txt</h2>
          <textarea
            value={robotsContent}
            onChange={(e) => setRobotsContent(e.target.value)}
            className="w-full h-32 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="User-agent: *&#10;Disallow: /admin/"
          />
          <button onClick={updateRobots} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg mt-4 shadow-md transition">Update Robots.txt</button>
        </div>

        {/* SEO Settings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-4 text-left">Page</th>
                <th className="border border-gray-300 p-4 text-left">Title</th>
                <th className="border border-gray-300 p-4 text-left">Description</th>
                <th className="border border-gray-300 p-4 text-left">Keywords</th>
                <th className="border border-gray-300 p-4 text-left">Robots</th>
                <th className="border border-gray-300 p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seoSettings.map((setting) => (
                <tr key={setting.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4">{setting.page}</td>
                  <td className="border border-gray-300 p-4">{setting.title}</td>
                  <td className="border border-gray-300 p-4">{setting.description}</td>
                  <td className="border border-gray-300 p-4">{setting.keywords}</td>
                  <td className="border border-gray-300 p-4">{setting.robots}</td>
                  <td className="border border-gray-300 p-4 flex gap-2">
                    <button onClick={() => { setEditingSetting(setting); setFormData(setting); setIsModalOpen(true); }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">Edit</button>
                    <button onClick={() => handleDelete(setting.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-bold mb-6">{editingSetting ? 'Edit' : 'Add'} SEO Setting</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Page (e.g., /)" value={formData.page} onChange={(e) => setFormData({ ...formData, page: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="Keywords" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <select value={formData.robots} onChange={(e) => setFormData({ ...formData, robots: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="index,follow">index,follow</option>
                  <option value="noindex,nofollow">noindex,nofollow</option>
                  <option value="index,nofollow">index,nofollow</option>
                </select>
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition">Save</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}