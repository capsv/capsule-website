import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import chartData from "../../../data/chart-data.json";
import "./RelevanceSection.css";

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RelevanceSection = ({ content, lang }) => {
  const { relevance, relevanceDescriptionCardOne, relevanceDescriptionCardTwo } = content;
  
  const [anxietyChartData, setAnxietyChartData] = useState(null);
  const [antiAnxietyChartData, setAntiAnxietyChartData] = useState(null);
  
  // Рефы для анимаций при прокрутке
  const [refHeader, inViewHeader] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  
  const [refCard1, inViewCard1] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [refCard2, inViewCard2] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [refChart, inViewChart] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Подготовка данных для графиков
  useEffect(() => {
    if (chartData) {
      const anxietyData = {
        labels: chartData.anxiety.map(item => item.year),
        datasets: [
          {
            label: lang === 'ru' ? 'Тревожность' : 'Anxiety',
            data: chartData.anxiety.map(item => item.value),
            borderColor: '#4e79a7',
            backgroundColor: 'rgba(78, 121, 167, 0.1)',
            pointBackgroundColor: '#4e79a7',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4e79a7',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
          }
        ]
      };
      
      const antiAnxietyData = {
        labels: chartData.antiAnxiety.map(item => item.year),
        datasets: [
          {
            label: lang === 'ru' ? 'Борьба с тревожностью' : 'Anti-anxiety',
            data: chartData.antiAnxiety.map(item => item.value),
            borderColor: '#f28e2c',
            backgroundColor: 'rgba(242, 142, 44, 0.1)',
            pointBackgroundColor: '#f28e2c',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#f28e2c',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
          }
        ]
      };
      
      setAnxietyChartData(anxietyData);
      setAntiAnxietyChartData(antiAnxietyData);
    }
  }, [chartData, lang]);

  // Объединенный график
  const combinedChartData = {
    labels: chartData.anxiety.map(item => item.year),
    datasets: [
      {
        label: lang === 'ru' ? 'Тревожность' : 'Anxiety',
        data: chartData.anxiety.map(item => item.value),
        borderColor: '#4e79a7',
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        pointBackgroundColor: '#4e79a7',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4e79a7',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: lang === 'ru' ? 'Борьба с тревожностью' : 'Anti-anxiety',
        data: chartData.antiAnxiety.map(item => item.value),
        borderColor: '#f28e2c',
        backgroundColor: 'rgba(242, 142, 44, 0.1)',
        pointBackgroundColor: '#f28e2c',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f28e2c',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      }
    ]
  };
  
  // Опции графика
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            family: "'Montserrat', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        bodyFont: {
          family: "'Montserrat', sans-serif"
        },
        titleFont: {
          family: "'Montserrat', sans-serif",
          weight: 'bold'
        },
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (items) => `${items[0].label} год`,
          label: (context) => {
            let value = context.raw;
            if (value >= 1000 && value < 1000000) {
              value = (value / 1000).toFixed(1) + 'k';
            } else if (value >= 1000000) {
              value = (value / 1000000).toFixed(1) + 'M';
            }
            return `${context.dataset.label}: ${value} запросов`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif"
          }
        },
        border: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: lang === 'ru' ? 'Тревожность' : 'Anxiety',
          font: {
            family: "'Montserrat', sans-serif",
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif"
          },
          callback: function(value) {
            if (value >= 1000) {
              return (value / 1000) + 'k';
            }
            return value;
          }
        },
        border: {
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: lang === 'ru' ? 'Борьба с тревожностью' : 'Anti-anxiety',
          font: {
            family: "'Montserrat', sans-serif",
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif"
          }
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    }
  };

  // Обновляем подпись с учетом данных до 2025 года
  const subtitleText = "2018 - 2025";

  return (
    <section className="relevance-section" id="relevance">
      <div className="relevance-container">
        <div className="relevance-header" ref={refHeader}>
          <h2 
            className={inViewHeader ? "animate-fade-in" : ""}
          >
            {relevance}
          </h2>
          <div 
            className={`relevance-subtitle ${inViewHeader ? "animate-fade-in-delay" : ""}`}
          >
            <span className="accent-line"></span>
            <p>{subtitleText}</p>
            <span className="accent-line"></span>
          </div>
        </div>
        
        <div className="relevance-content">
          <div className="relevance-cards">
            <div 
              ref={refCard1} 
              className={`relevance-card ${inViewCard1 ? "fade-in-left" : ""}`}
            >
              <div className="relevance-card-content">
                <div className="relevance-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4e79a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                  </svg>
                </div>
                <h3>{lang === 'ru' ? 'Тревожность' : 'Anxiety'}</h3>
                <p>{relevanceDescriptionCardOne}</p>
                <div className="relevance-stats">
                  <div className="relevance-stat">
                    <span className="relevance-stat-number">4×</span>
                    <span className="relevance-stat-label">{lang === 'ru' ? 'рост' : 'growth'}</span>
                  </div>
                </div>
              </div>
              <div className="relevance-card-chart">
                {anxietyChartData && 
                  <Line 
                    data={anxietyChartData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          ...chartOptions.scales.x,
                          border: {
                            display: false
                          },
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          ...chartOptions.scales.y,
                          border: {
                            display: false
                          },
                          grid: {
                            display: false
                          },
                          ticks: {
                            display: false
                          },
                          title: {
                            display: false
                          }
                        },
                        y1: {
                          display: false
                        }
                      },
                      layout: {
                        padding: {
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10
                        }
                      }
                    }} 
                    height={160}
                  />
                }
              </div>
            </div>
            
            <div 
              ref={refCard2} 
              className={`relevance-card ${inViewCard2 ? "fade-in-right" : ""}`}
            >
              <div className="relevance-card-content">
                <div className="relevance-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f28e2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10"></path>
                    <path d="M12 20V4"></path>
                    <path d="M6 20v-6"></path>
                  </svg>
                </div>
                <h3>{lang === 'ru' ? 'Борьба с тревожностью' : 'Anti-anxiety'}</h3>
                <p>{relevanceDescriptionCardTwo}</p>
                <div className="relevance-stats">
                  <div className="relevance-stat">
                    <span className="relevance-stat-number">17×</span>
                    <span className="relevance-stat-label">{lang === 'ru' ? 'рост' : 'growth'}</span>
                  </div>
                </div>
              </div>
              <div className="relevance-card-chart">
                {antiAnxietyChartData && 
                  <Line 
                    data={antiAnxietyChartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          ...chartOptions.scales.x,
                          border: {
                            display: false
                          },
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          display: false
                        },
                        y1: {
                          position: 'left',
                          display: true,
                          border: {
                            display: false
                          },
                          grid: {
                            display: false
                          },
                          ticks: {
                            display: false
                          },
                          title: {
                            display: false
                          }
                        }
                      },
                      layout: {
                        padding: {
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10
                        }
                      }
                    }}
                    height={160}
                  />
                }
              </div>
            </div>
          </div>
          
          <div 
            ref={refChart} 
            className={`relevance-chart-container ${inViewChart ? "fade-in-up" : ""}`}
          >
            <h3>{lang === 'ru' ? 'Динамика роста запросов' : 'Request growth dynamics'}</h3>
            <div className="relevance-chart">
              <Line 
                data={combinedChartData} 
                options={chartOptions}
                height={300}
              />
            </div>
            <div className="relevance-chart-note">
              <p>{lang === 'ru' ? 'Данные получены из Яндекс Вордстат за период с января 2018 по январь 2025' : 'Data from Yandex Wordstat for the period from January 2018 to January 2025'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

RelevanceSection.propTypes = {
  content: PropTypes.shape({
    relevance: PropTypes.node.isRequired,
    relevanceDescriptionCardOne: PropTypes.string.isRequired,
    relevanceDescriptionCardTwo: PropTypes.string.isRequired,
  }).isRequired,
  lang: PropTypes.string,
};

RelevanceSection.defaultProps = {
  lang: 'ru'
};

export default RelevanceSection;