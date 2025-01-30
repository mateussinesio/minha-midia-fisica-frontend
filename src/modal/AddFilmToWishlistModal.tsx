import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/add-film-to-wishlist-modal.css';

interface AddFilmToWishlistModalProps {
  film: {
    id: number;
    title: string;
    original_title: string;
    release_date: string;
    director: string;
    overview: string;
    poster_path: string;
  };
  onClose: () => void;
}

const AddFilmToWishlistModal: React.FC<AddFilmToWishlistModalProps> = ({ film, onClose }) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8081/categories', { withCredentials: true });
        setAvailableCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  const checkIfFilmInWishlist = async () => {
    try {
      const response = await axios.get('http://localhost:8081/wishlist/check', {
        params: { filmId: film.id },
        withCredentials: true,
      });
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar se o filme está na lista de desejos:', error);
      return false;
    }
  };

  const addToWishlist = async () => {
    if (!selectedCategories || selectedCategories.length === 0) {
      alert('Adicione pelo menos uma categoria.');
      return;
    }

    try {
      const isFilmInWishlist = await checkIfFilmInWishlist();
      if (isFilmInWishlist) {
        alert('Este filme já está na sua lista de desejos!');
        return;
      }

      await axios.post(
        'http://localhost:8081/wishlist/add',
        {
          filmId: film.id,
          title: film.title,
          releaseDate: film.release_date,
          originalTitle: film.original_title,
          director: film.director,
          overview: film.overview,
          posterPath: film.poster_path,
          categories: selectedCategories,
        },
        { withCredentials: true }
      );
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar filme à lista de desejos:', error);
      alert('Erro ao adicionar o filme. Tente novamente.');
    }
  };

  const handleAddCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  return (
    <div className="add-film-to-wishlist-modal-background">
      <div className="add-film-to-wishlist-modal-container">
        <h3>Escolha categorias para "{film.title} {film.release_date}"</h3>
        <div className="add-film-to-wishlist-modal-category-selection-container">
          <h4 className="add-film-to-wishlist-modal-category-selection-title">Categorias disponíveis:</h4>
          <ul className="add-film-to-wishlist-modal-category-list">
            {availableCategories.map((category) => (
              <li key={category}>
                {category}
                <button onClick={() => handleAddCategory(category)}>Adicionar</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="add-film-to-wishlist-modal-selected-categories-container">
        <h4 className="add-film-to-wishlist-modal-category-selected-title">Categorias selecionadas:</h4>
          <ul className="add-film-to-wishlist-modal-category-list">
            {selectedCategories.map((category) => (
              <li key={category}>
                {category}
                <button onClick={() => handleRemoveCategory(category)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="add-film-to-wishlist-modal-buttons">
          <button onClick={addToWishlist}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AddFilmToWishlistModal;