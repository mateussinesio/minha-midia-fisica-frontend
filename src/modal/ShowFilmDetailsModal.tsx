import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../modal/styles/show-film-details-modal.css";

interface WishListItem {
  filmId: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  categories: string[];
  releaseDate: string;
  director: string;
  overview: string;
}

interface ShowFilmDetailsModalProps {
  film: WishListItem;
  onClose: () => void;
  onRemove: (filmId: number) => void;
  onSave: () => void;
}

const ShowFilmDetailsModal: React.FC<ShowFilmDetailsModalProps> = ({ film, onClose, onRemove, onSave }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [filmCategories, setFilmCategories] = useState<string[]>(film.categories);
  const [newCategory, setNewCategory] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/categories', { withCredentials: true })
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar categorias:', error);
      });
  }, []);

  const handleRemoveCategory = (category: string) => {
    if (filmCategories.length > 1) {
      setFilmCategories(filmCategories.filter(cat => cat !== category));
    } else {
      alert("O filme deve ter pelo menos uma categoria.");
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !filmCategories.includes(newCategory)) {
      setFilmCategories([...filmCategories, newCategory]);
      setNewCategory("");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:8081/wishlist/update-categories/${film.filmId}`,
        { categories: filmCategories },
        { withCredentials: true }
      );
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar categorias:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategorySelect = (category: string) => {
    setNewCategory(category);
    setDropdownOpen(false);
  };

  return (
    <div className="show-film-details-modal-background">
      <div className="show-film-details-modal-container">
        <div className="show-film-details-modal-film-title-and-director-container">
          <h3 className="show-film-details-modal-film-title">{film.title || 'Não disponível'} {film.releaseDate || 'Não disponível'}</h3>
          <h3 className="show-film-details-modal-original-film-title">{film.originalTitle || 'Não disponível'}</h3>
          <h3 className="show-film-details-modal-film-director">Dirigido por: {film.director || 'Não disponível'}</h3>
        </div>
        <div className="show-film-details-modal-film-poster">
          <img
            src={`https://image.tmdb.org/t/p/w200${film.posterPath}`}
            alt={film.title}
          />
        </div>
        <div className="show-film-details-modal-film-overview-container">
          <p className="show-film-details-modal-film-overview"><strong>Sinopse:</strong> {film.overview}</p>
        </div>
        <div className="show-film-details-modal-film-current-categories-container">
          <h4>Categorias:</h4>
          <ul>
            {filmCategories.map(category => (
              <li key={category}>
                {category}{" "}
                <button onClick={() => handleRemoveCategory(category)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="show-film-details-modal-dropdown-menu">
          <button className="show-film-details-modal-dropdown-menu-button" onClick={toggleDropdown}>
            {newCategory || 'Selecione uma categoria'} <span className="arrow">&#9662;</span>
          </button>
          {dropdownOpen && (
            <ul className="show-film-details-modal-dropdown-menu-options">
              {categories.map((category) => (
                <li key={category} onClick={() => handleCategorySelect(category)}>
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="show-film-details-modal-add-category-button-container">
          <button onClick={handleAddCategory}>Adicionar Categoria</button>
        </div>
        <div className="show-film-details-modal-buttons">
          <button onClick={onClose}>Fechar</button>
          <button onClick={handleSaveChanges}>Salvar Alterações</button>
          <button onClick={() => onRemove(film.filmId)} className="remove-film-button">Remover da Lista</button>
        </div>
      </div>
    </div>
  );
};

export default ShowFilmDetailsModal;