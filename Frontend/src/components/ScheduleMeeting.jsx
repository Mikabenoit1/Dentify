import React, { useState, useEffect } from 'react';
import '../styles/ScheduleMeeting.css';

const ScheduleMeeting = ({ isOpen, onClose, candidat, offerId, onSchedule }) => {
  // Liste des contacts disponibles pour les rendez-vous (normalement provenant de la messagerie)
  const [contacts, setContacts] = useState([
    { id: 101, name: 'Dr. Leslie Labrecque', profession: 'dentiste' },
    { id: 102, name: 'Thomas Simard', profession: 'assistant' },
    { id: 103, name: 'Marie Curie', profession: 'hygieniste' },
    { id: 104, name: 'Jean Dupont', profession: 'dentiste' },
    { id: 105, name: 'Sophie Tremblay', profession: 'assistant' }
  ]);

  // Initialiser l'état avec des valeurs par défaut
  const [meetingData, setMeetingData] = useState({
    title: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    meetingType: 'video',
    notes: '',
    candidatId: '',
    candidatName: '',
    candidatProfession: ''
  });

  // Mettre à jour le titre automatiquement quand le candidat change
  useEffect(() => {
    if (candidat && candidat.name) {
      setMeetingData(prev => ({
        ...prev,
        title: `Rencontre avec ${candidat.name}`,
        candidatId: candidat.id,
        candidatName: candidat.name,
        candidatProfession: candidat.profession
      }));
    }
  }, [candidat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'selectedCandidat' && value) {
      // Si un contact est sélectionné, mettre à jour les infos du candidat
      const selectedContact = contacts.find(c => c.id.toString() === value);
      if (selectedContact) {
        setMeetingData(prev => ({
          ...prev,
          candidatId: selectedContact.id,
          candidatName: selectedContact.name,
          candidatProfession: selectedContact.profession,
          title: `Rencontre avec ${selectedContact.name}`
        }));
      }
    } else {
      setMeetingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({
      ...meetingData,
      offerId: offerId,
      status: 'scheduled'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="schedule-modal-overlay" onClick={onClose}>
      <div className="schedule-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="schedule-modal-header">
          <h3>Planifier une rencontre</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="schedule-modal-content">
          <div className="form-grid">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="title">
                  <i className="fa-solid fa-heading icon-label"></i>
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={meetingData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Titre du rendez-vous"
                  required
                />
              </div>
              
              {!candidat && (
                <div className="form-group">
                  <label htmlFor="selectedCandidat">
                    <i className="fa-solid fa-user icon-label"></i>
                    Avec qui?
                  </label>
                  <select
                    id="selectedCandidat"
                    name="selectedCandidat"
                    value={meetingData.candidatId}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Sélectionner un contact</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} ({contact.profession === 'dentiste' ? 'Dentiste' : 
                                        contact.profession === 'assistant' ? 'Assistant(e)' : 'Hygiéniste'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="date">
                  <i className="fa-solid fa-calendar icon-label"></i>
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={meetingData.date}
                  onChange={handleChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">
                    <i className="fa-solid fa-clock icon-label"></i>
                    Heure de début
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={meetingData.startTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endTime">
                    <i className="fa-solid fa-hourglass-end icon-label"></i>
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={meetingData.endTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="meetingType">
                  <i className="fa-solid fa-video icon-label"></i>
                  Type de rencontre
                </label>
                <div className="meeting-type-options">
                  <label className={`meeting-type-option ${meetingData.meetingType === 'video' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="meetingType"
                      value="video"
                      checked={meetingData.meetingType === 'video'}
                      onChange={handleChange}
                      hidden
                    />
                    <div className="meeting-type-icon">
                      <i className="fa-solid fa-video"></i>
                    </div>
                    <div className="meeting-type-text">Vidéoconférence</div>
                  </label>
                  
                  <label className={`meeting-type-option ${meetingData.meetingType === 'phone' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="meetingType"
                      value="phone"
                      checked={meetingData.meetingType === 'phone'}
                      onChange={handleChange}
                      hidden
                    />
                    <div className="meeting-type-icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="meeting-type-text">Appel téléphonique</div>
                  </label>
                  
                  <label className={`meeting-type-option ${meetingData.meetingType === 'inPerson' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="meetingType"
                      value="inPerson"
                      checked={meetingData.meetingType === 'inPerson'}
                      onChange={handleChange}
                      hidden
                    />
                    <div className="meeting-type-icon">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="meeting-type-text">En personne</div>
                  </label>
                </div>
              </div>
              
              <div className="form-group notes-group">
                <label htmlFor="notes">
                  <i className="fa-solid fa-sticky-note icon-label"></i>
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={meetingData.notes}
                  onChange={handleChange}
                  className="form-input notes-input"
                  placeholder="Informations complémentaires pour le rendez-vous..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Afficher les informations du candidat sélectionné */}
          {(candidat || meetingData.candidatName) && (
            <div className="participant-info">
              <div className={`participant-avatar ${candidat ? candidat.profession : meetingData.candidatProfession}`}>
                <span>{(candidat ? candidat.name : meetingData.candidatName).charAt(0).toUpperCase()}</span>
              </div>
              <div className="participant-details">
                <span className="participant-name">{candidat ? candidat.name : meetingData.candidatName}</span>
                <span className="participant-profession">{
                  (candidat ? candidat.profession : meetingData.candidatProfession) === 'dentiste' ? 'Dentiste' :
                  (candidat ? candidat.profession : meetingData.candidatProfession) === 'assistant' ? 'Assistant(e) dentaire' :
                  (candidat ? candidat.profession : meetingData.candidatProfession) === 'hygieniste' ? 'Hygiéniste dentaire' :
                  'Professionnel de santé'
                }</span>
              </div>
            </div>
          )}
          
          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              <i className="fa-solid fa-times"></i> Annuler
            </button>
            <button type="submit" className="confirm-button">
              <i className="fa-solid fa-check"></i> Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeeting;