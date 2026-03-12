import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Search, Trophy, Users, Shield, ArrowRight, Trash2, Edit3, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ClubModal from '../components/ClubModal';

const ClubSkeleton = () => (
  <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }} className="skeleton-pulse" />
      <div style={{ flex: 1 }}>
        <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '8px', width: '70%' }} className="skeleton-pulse" />
        <div style={{ height: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '40%' }} className="skeleton-pulse" />
      </div>
    </div>
    <div style={{ height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '24px' }} className="skeleton-pulse" />
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} className="skeleton-pulse" />
      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} className="skeleton-pulse" />
      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} className="skeleton-pulse" />
    </div>
  </div>
);

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const limit = 6;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClubs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCountry, page]);

  const fetchNations = async () => {
    try {
      const data = await api.get('/nations');
      setNations(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        countries: selectedCountry ? [selectedCountry] : []
      };
      const data = await api.get('/clubs', { params });
      setClubs(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e, club) => {
    e.stopPropagation();
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        await api.delete(`/clubs/${id}`);
        setClubs(clubs.filter(c => c._id !== id));
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <nav style={{ padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10, 10, 12, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ClubManager</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.username}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Administrator</p>
          </div>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '10px 16px' }}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: '60px 10%', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3rem', marginBottom: '16px' }}
        >
          Manage your <span style={{ color: 'var(--primary)' }}>Football World</span>
        </motion.h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px' }}>
          Explore, create and manage top football clubs from around the globe with our modern dashboard.
        </p>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search clubs by name..." 
              style={{ paddingLeft: '56px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', height: '60px', fontSize: '1.1rem' }}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div style={{ position: 'relative', flex: '0 0 200px' }}>
            <Filter size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <select 
              className="input-field" 
              style={{ paddingLeft: '50px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', height: '60px', appearance: 'none' }}
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">All Countries</option>
              {nations.map(n => (
                <option key={n._id} value={n._id}>{n.name}</option>
              ))}
            </select>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ borderRadius: '100px', height: '60px', padding: '0 32px' }}>
            <Plus size={24} /> <span style={{ display: 'none', sm: 'inline' }}>Add Club</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '20px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', minHeight: '600px' }}>
        <AnimatePresence>
          {loading ? (
            Array(limit).fill(0).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ClubSkeleton />
              </motion.div>
            ))
          ) : (
            clubs.map((club, index) => (
              <motion.div
                layout
                key={club._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="glass-card fade-in"
                style={{ padding: '24px', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => navigate(`/club/${club._id}`)}
                whileHover={{ y: -5, borderColor: 'var(--primary)' }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', background: '#222' }}>
                    <img src={club.logoURL} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{club.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={club.nationality?.flagURL} style={{ width: '18px', borderRadius: '2px' }} />
                      {club.nationality?.name}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Players</p>
                    <p style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {club.numberOfPlayers || 11}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '10px' }} onClick={() => navigate(`/club/${club._id}`)}>
                    View <ArrowRight size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleEdit(e, club)}
                    className="btn btn-outline" 
                    style={{ color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, club._id)}
                    className="btn btn-outline" 
                    style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                  <Shield size={100} color="var(--primary)" />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {!loading && total > limit && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', alignItems: 'center' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="btn btn-outline"
            style={{ padding: '10px 16px', opacity: page === 1 ? 0.3 : 1 }}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontWeight: 600 }}>Page {page} of {Math.ceil(total / limit)}</span>
          <button 
            disabled={page >= Math.ceil(total / limit)} 
            onClick={() => setPage(p => p + 1)}
            className="btn btn-outline"
            style={{ padding: '10px 16px', opacity: page >= Math.ceil(total / limit) ? 0.3 : 1 }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {!loading && clubs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
          <Search size={48} style={{ marginBottom: '16px' }} />
          <h3>No clubs found matching your criteria</h3>
        </div>
      )}

      <ClubModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClub(null);
        }} 
        club={selectedClub}
        onSuccess={fetchClubs} 
      />
    </div>
  );
};

export default Home;
