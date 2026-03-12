import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, User, Calendar, MapPin, Shield, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ClubModal from '../components/ClubModal';

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const resp = await api.get(`/clubs/${id}`);
      setData(resp);
    } catch (error) {
      alert(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        await api.delete(`/clubs/${id}`);
        navigate('/');
      } catch (error) {
        alert(error);
      }
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading details...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Top Bar */}
      <div style={{ padding: '20px 5%', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ borderRadius: '50%', padding: '12px' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span>Clubs</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)' }}>{data.name}</span>
        </div>
      </div>

      <div style={{ padding: '0 5% 60px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Club Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '40px', alignItems: 'center' }}
        >
          <div style={{ width: '200px', height: '200px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '4px solid var(--border)' }}>
            <img src={data.logoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '3.5rem' }}>{data.name}</h1>
              <img src={data.nationality?.flagURL} style={{ width: '40px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--text-muted)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> {data.nationality?.name}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Head Coach: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{data.headCoach?.name || 'N/A'}</span></p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                <Edit3 size={18} /> Edit Club
              </button>
              <button onClick={handleDelete} className="btn btn-outline" style={{ color: '#ef4444' }}>
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        </motion.div>

        {/* Players Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Squad Players</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {data.players?.map((player, idx) => (
              <motion.div 
                key={player._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '20px', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User color="white" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem' }}>{player.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {player.yob}</p>
                    <span>•</span>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <img src={player.nationality?.flagURL} style={{ width: '14px', borderRadius: '1px' }} /> {player.nationality?.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!data.players || data.players.length === 0) && (
              <p style={{ color: 'var(--text-muted)' }}>No players found in this club.</p>
            )}
          </div>
        </div>
      </div>

      <ClubModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        club={data}
        onSuccess={fetchDetail} 
      />
    </div>
  );
};

export default ClubDetail;
