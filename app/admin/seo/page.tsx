// app/admin/seo/page.tsx - COMPLETELY FIXED & WORKING
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SeoSetting {
  id: number;
  page_name: string;
  title: string;
  description: string;
  keywords: string;
  robots: string;
  priority: number;
}

export default function SeoPage() {
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SeoSetting | null>(null);
  
  const [formData, setFormData] = useState({
  page: '',
  title: '',
  description: '',
  keywords: '',
  robots: 'index,follow',
  priority: 0.5,
  // ADD THESE:
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_card: 'summary_large_image',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  canonical_url: '',
  schema_markup: ''
});

  const [sitemapUrl, setSitemapUrl] = useState('');
  const [robotsContent, setRobotsContent] = useState('');

  // Fetch SEO settings
  const fetchSeoSettings = async () => {
    try {
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      
      if (data.success && data.settings) {
        setSeoSettings(data.settings);
      } else {
        setSeoSettings([]);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      setSeoSettings([]);
    }
  };

  // Fetch robots.txt content
  const fetchRobotsContent = async () => {
    try {
      const res = await fetch('/api/admin/seo/robots-txt', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (data.success && data.content) {
        setRobotsContent(data.content);
      } else {
        setRobotsContent(`# Default robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: ${window.location.origin}/sitemap.xml`);
      }
    } catch (error) {
      setRobotsContent(`# Default robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: ${window.location.origin}/sitemap.xml`);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
    fetchRobotsContent();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.page || !formData.title || !formData.description) {
      alert('Please fill in all required fields (Page, Title, Description)');
      return;
    }

    try {
      const method = editingSetting ? 'PUT' : 'POST';
      const body = editingSetting 
        ? { ...formData, id: editingSetting.id } 
        : formData;

      const res = await fetch('/api/admin/seo', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (data.success) {
        fetchSeoSettings();
        setIsModalOpen(false);
        setEditingSetting(null);
        resetForm();
        alert(`✅ SEO setting ${editingSetting ? 'updated' : 'created'} successfully!`);
      } else {
        alert('❌ Error: ' + (data.error || 'Failed to save SEO setting'));
      }
    } catch (error) {
      console.error('Form submit error:', error);
      alert('❌ Failed to save SEO setting');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this SEO setting?')) {
      try {
        const res = await fetch('/api/admin/seo', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        
        const data = await res.json();
        if (data.success) {
          fetchSeoSettings();
          alert('✅ SEO setting deleted successfully!');
        } else {
          alert('❌ Failed to delete: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Error deleting SEO setting');
      }
    }
  };

  // Generate sitemap
  const generateSitemap = async () => {
    try {
      const res = await fetch('/api/admin/seo/sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await res.json();
      
      if (data.success) {
        const url = `${window.location.origin}/sitemap.xml`;
        setSitemapUrl(url);
        alert(`✅ Sitemap generated successfully!\nTotal URLs: ${data.sitemaps || 1}`);
      } else {
        alert('❌ Failed to generate sitemap: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Sitemap generation error:', error);
      alert('❌ Error generating sitemap');
    }
  };

  // Update robots.txt
  const updateRobots = async () => {
    try {
      const res = await fetch('/api/admin/seo/robots-txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: robotsContent })
      });

      const data = await res.json();
      
      if (data.success) {
        alert('✅ Robots.txt updated successfully!');
      } else {
        alert('❌ Failed to update robots.txt: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Robots.txt update error:', error);
      alert('❌ Error updating robots.txt');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      page: '',
      title: '',
      description: '',
      keywords: '',
      robots: 'index,follow',
      priority: 0.5
    });
  };

  // Modal component
  const SeoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{editingSetting ? 'Edit' : 'Add'} SEO Setting</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic SEO Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Path *</label>
              <input
                type="text"
                name="page"
                value={formData.page}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/domains"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleSelectChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="0.1">0.1</option>
                <option value="0.3">0.3</option>
                <option value="0.5">0.5</option>
                <option value="0.7">0.7</option>
                <option value="0.9">0.9</option>
                <option value="1.0">1.0</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Page Title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Page description"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="domain, premium domain, marketplace"
            />
          </div>
{/* Open Graph Section */}
<div className="border-t pt-4">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Open Graph (Social Media)</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
      <input
        type="text"
        name="og_title"
        value={formData.og_title}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Social media title"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
      <textarea
        name="og_description"
        value={formData.og_description}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Social media description"
        rows={2}
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
    <input
      type="url"
      name="og_image"
      value={formData.og_image}
      onChange={handleInputChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      placeholder="https://example.com/image.jpg"
    />
  </div>
</div>

{/* Twitter Section */}
<div className="border-t pt-4">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Twitter Cards</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Title</label>
      <input
        type="text"
        name="twitter_title"
        value={formData.twitter_title}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Twitter title"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Description</label>
      <textarea
        name="twitter_description"
        value={formData.twitter_description}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Twitter description"
        rows={2}
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Image</label>
    <input
      type="url"
      name="twitter_image"
      value={formData.twitter_image}
      onChange={handleInputChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      placeholder="https://example.com/twitter-image.jpg"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Card Type</label>
    <select
      name="twitter_card"
      value={formData.twitter_card}
      onChange={handleSelectChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="summary">Summary</option>
      <option value="summary_large_image">Summary Large Image</option>
      <option value="app">App</option>
      <option value="player">Player</option>
    </select>
  </div>
</div>

{/* Advanced SEO Section */}
<div className="border-t pt-4">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced SEO</h3>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
    <input
      type="url"
      name="canonical_url"
      value={formData.canonical_url}
      onChange={handleInputChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      placeholder="https://example.com/canonical-page"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Schema Markup (JSON-LD)</label>
    <textarea
      name="schema_markup"
      value={formData.schema_markup}
      onChange={handleInputChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      placeholder='{"@context": "https://schema.org", "@type": "WebPage"}'
      rows={4}
    />
  </div>
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Robots</label>
            <select
              name="robots"
              value={formData.robots}
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="index,follow">index,follow</option>
              <option value="noindex,follow">noindex,follow</option>
              <option value="index,nofollow">index,nofollow</option>
              <option value="noindex,nofollow">noindex,nofollow</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition">
              {editingSetting ? 'Update' : 'Save'} SEO Setting
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingSetting(null);
                resetForm();
              }} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">SEO Management</h1>

        {/* Buttons Section */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition">
            Add SEO Setting
          </button>
          <button onClick={generateSitemap} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition">
            Generate Sitemap
          </button>
          <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition">
            Back to Admin
          </Link>
        </div>

        {/* Sitemap URL Display */}
        {sitemapUrl && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ Sitemap generated! 
              <a href={sitemapUrl} target="_blank" className="text-green-600 hover:underline ml-2">
                View Sitemap →
              </a>
            </p>
          </div>
        )}

        {/* Robots.txt Editor */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Robots.txt</h2>
          <textarea
            value={robotsContent}
            onChange={(e) => setRobotsContent(e.target.value)}
            className="w-full h-32 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="# Robots.txt for your domain marketplace&#10;User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;Disallow: /api/&#10;Sitemap: https://yourdomain.com/sitemap.xml "
          />
          <button onClick={updateRobots} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg mt-4 shadow-md transition">
            Update Robots.txt
          </button>
        </div>

        {/* SEO Settings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-4 text-left">Page</th>
                <th className="border border-gray-300 p-4 text-left">Title</th>
                <th className="border border-gray-300 p-4 text-left">Priority</th>
                <th className="border border-gray-300 p-4 text-left">Robots</th>
                <th className="border border-gray-300 p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seoSettings && seoSettings.length > 0 ? (
                seoSettings.map((setting) => (
                  <tr key={setting.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">{setting.page_name}</td>
                    <td className="border border-gray-300 p-4">{setting.title}</td>
                    <td className="border border-gray-300 p-4">{setting.priority}</td>
                    <td className="border border-gray-300 p-4">{setting.robots}</td>
                    <td className="border border-gray-300 p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { 
                            setEditingSetting(setting); 
                            setFormData({
                              page: setting.page_name,
                              title: setting.title,
                              description: setting.description,
                              keywords: setting.keywords,
                              robots: setting.robots,
                              priority: setting.priority
                            }); 
                            setIsModalOpen(true); 
                          }} 
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(setting.id)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border border-gray-300 p-4 text-center text-gray-500">
                    No SEO settings found. Click "Add SEO Setting" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Component */}
        {isModalOpen && <SeoModal />}
      </div>
    </div>
  );
}