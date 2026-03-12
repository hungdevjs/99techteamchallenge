import { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Loader2, Save, Image as ImageIcon, MapPin, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClubModal = ({ isOpen, onClose, club, onSuccess }) => {
  const [nations, setNations] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    logoURL: '',
    headCoach: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNations();
      fetchCoaches();
      if (club) {
        setFormData({
          name: club.name,
          nationality: club.nationality?._id || club.nationality,
          logoURL: club.logoURL,
          headCoach: club.headCoach?._id || club.headCoach || ''
        });
      } else {
        setFormData({ name: '', nationality: '', logoURL: '', headCoach: '' });
      }
    }
  }, [isOpen, club]);

  const fetchNations = async () => {
    try {
      const data = await api.get('/nations'); 
      setNations(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCoaches = async () => {
    try {
      const data = await api.get('/coaches');
      setCoaches(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (club) {
        await api.put(`/clubs/${club._id}`, formData);
      } else {
        await api.post('/clubs', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', zIndex: 1 }}
      >
        <button onClick={onClose} style={{ position: 'absolute', right: '24px', top: '24px', color: 'var(--text-muted)' }} className="btn-outline">
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{club ? 'Update Club' : 'Create New Club'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Fill in the information below to manage the club.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Club Name</label>
            <input 
              className="input-field" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Manchester United"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nationality</label>
            <select 
              className="input-field" 
              style={{ paddingRight: '40px' }}
              value={formData.nationality}
              onChange={e => setFormData({...formData, nationality: e.target.value})}
              required
            >
              <option value="">Select a country</option>
              {nations.map(n => (
                <option key={n._id} value={n._id}>{n.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Logo URL</label>
            <input 
              className="input-field" 
              value={formData.logoURL} 
              onChange={e => setFormData({...formData, logoURL: e.target.value})}
              placeholder="https://..."
              required
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Head Coach</label>
            <select 
              className="input-field" 
              style={{ paddingRight: '40px' }}
              value={formData.headCoach}
              onChange={e => setFormData({...formData, headCoach: e.target.value})}
            >
              <option value="">Select a coach (optional)</option>
              {coaches.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> {club ? 'Save Changes' : 'Create Club'}</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ClubModal;
