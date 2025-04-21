
import React, { useEffect, useState } from 'react';
import './ProfessionnelNotifications.css';
import { useNavigate } from 'react-router-dom';

const ProfessionnelNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:4000/api/notifications/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (err) {
        console.error("Erreur chargement des notifications :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notif) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${notif.id_notification}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate(notif.lien_action || '/');
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la notification :", err);
    }
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="pro-notifications-page">
      <h2>Mes notifications</h2>
      {notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="pro-notifications-list">
          {notifications.map((notif) => (
            <li
              key={notif.id_notification}
              className={`pro-notification-item ${notif.est_lue === 'N' ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <p>{notif.contenu}</p>
              <span className="pro-date">{new Date(notif.date_creation).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfessionnelNotifications;
