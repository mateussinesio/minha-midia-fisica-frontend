import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFilmToWishlistModal from '../modal/AddFilmToWishlistModal';
import './styles/home.css';

interface Film {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  director: string;
  overview: string;
  poster_path: string;
}

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const [query, setQuery] = useState('');
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showModal, setShowModal] = useState(false);

  const searchFilms = async () => {
    if (!query.trim()) return;
    try {
      const response = await axios.get('http://localhost:8081/films/search', {
        params: { query },
        withCredentials: true,
      });
      setFilms(response.data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    }
  };

  const handleOpenModal = (film: Film) => {
    setSelectedFilm(film);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFilm(null);
    setShowModal(false);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchFilms();
    }
  };

  useEffect(() => {
    if (!query) {
      setFilms([]);
    }
  }, [query]);

  return (
    <div className="search-film-container">
      <div className="search-film-input-container">
        <input
          className="search-film-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="Digite o nome do filme"
        />
        <button className="search-film-button" onClick={searchFilms}>
          Pesquisar
        </button>
      </div>

      <ul className="films-container">
        {films.map((film) => (
          <li className="film-card" key={film.id}>
            <div className="film-poster">
              {film.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${film.poster_path}`}
                  alt={film.title}
                />
              )}
            </div>
            <div className="film-details">
              <div className="film-title-container">
                <h3 className="film-title">
                  {film.title} {film.release_date}
                </h3>
                <h3 className="original-film-title">{film.original_title}</h3>
                <h3 className="film-director">Dirigido por: {film.director}</h3>
              </div>
              <p className="film-overview">{film.overview}</p>
              {isLoggedIn && (
                <div className="add-to-wishlist-button-container">
                  <button
                    className="add-to-wishlist-button"
                    onClick={() => handleOpenModal(film)}
                  >
                    Adicionar à lista de desejos
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {showModal && selectedFilm && (
        <AddFilmToWishlistModal
          film={selectedFilm}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;