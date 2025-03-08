import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #343a40;
  margin-bottom: 1.5rem;
  max-width: 600px;
`;

const ResetButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0069d9;
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние, чтобы при следующем рендере показать запасной UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Можно также отправить отчет об ошибке в сервис аналитики
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Здесь можно добавить код для отправки отчета об ошибке на сервер
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // Если предоставлен пользовательский fallback, используем его
      if (fallback) {
        return fallback({ error, resetErrorBoundary: this.resetErrorBoundary });
      }

      // Иначе используем дефолтный UI для ошибок
      return (
        <ErrorContainer>
          <ErrorTitle>Что-то пошло не так</ErrorTitle>
          <ErrorMessage>
            Произошла ошибка в работе приложения. Пожалуйста, попробуйте обновить страницу или вернитесь позже.
          </ErrorMessage>
          <ResetButton onClick={() => window.location.reload()}>
            Обновить страницу
          </ResetButton>
        </ErrorContainer>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
};

export default ErrorBoundary; 