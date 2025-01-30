import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShowFilmDetailsModal from '../modal/ShowFilmDetailsModal';
import "./styles/wishlist.css";

interface WishListFilm {
  filmId: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  categories: string[];
  releaseDate: string;
  director: string;
  overview: string;
}

const WishList: React.FC = () => {
  const [wishList, setWishList] = useState<WishListFilm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilm, setSelectedFilm] = useState<WishListFilm | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchWishList = async () => {
    try {
      const response = await axios.get('http://localhost:8081/wishlist', {
        withCredentials: true,
      });
      setWishList(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar a lista de desejos:', error);
    }
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredWishList = wishList.filter((film) => {
    const matchesCategory = selectedCategory
      ? film.categories.includes(selectedCategory)
      : true;
    const matchesSearch =
      (film.title && removeAccents(film.title.toLowerCase()).includes(removeAccents(searchQuery.toLowerCase()))) ||
      (film.originalTitle && removeAccents(film.originalTitle.toLowerCase()).includes(removeAccents(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(wishList.flatMap((film) => film.categories)));

  const handleOpenModal = (filmId: number) => {
    const film = wishList.find((film) => film.filmId === filmId);
    if (film) setSelectedFilm(film);
  };

  const handleCloseModal = () => {
    setSelectedFilm(null);
  };

  const handleRemoveFilm = async (filmId: number) => {
    try {
      await axios.delete(`http://localhost:8081/wishlist/remove/${filmId}`, { withCredentials: true });

      setWishList((prevList) => prevList.filter((film) => film.filmId !== filmId));

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao remover o filme da lista de desejos:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  if (isLoading) {
    return <p className='loading'>Carregando lista de desejos...</p>;
  }

  if (wishList.length === 0) {
    return <p className='no-films-in-your-wishlist-message' >Você ainda não adicionou nenhum filme à sua lista de desejos.</p>;
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-filter">
        <label htmlFor="category-select">Filtrar por categoria:</label>
        <div className="wishlist-dropdown-menu">
          <button className="wishlist-dropdown-menu-button" onClick={toggleDropdown}>
            {selectedCategory || 'Todas'} <span className="arrow">&#9662;</span>
          </button>
          {dropdownOpen && (
            <ul className="wishlist-dropdown-menu-options">
              <li onClick={() => handleCategorySelect('')}>Todas</li>
              {categories.map((category) => (
                <li key={category} onClick={() => handleCategorySelect(category)}>
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="wishlist-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar filme"
        />
      </div>

      <ul className="wishlist-film-container">
        {filteredWishList.map((film) => (
          <li className="wishlist-film-card" key={film.filmId}>
            <div
              className="wishlist-film-poster-container"
              onClick={() => handleOpenModal(film.filmId)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${film.posterPath}`}
                alt="Filme"
              />
            </div>
          </li>
        ))}
      </ul>

      {selectedFilm && (
        <ShowFilmDetailsModal
          film={selectedFilm}
          onClose={handleCloseModal}
          onRemove={handleRemoveFilm}
          onSave={fetchWishList}
        />
      )}
    </div>
  );
};

export default WishList;