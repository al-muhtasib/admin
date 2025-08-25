import { useEffect, useState, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', date: '', description: '', images: [] });
  const [sermons, setSermons] = useState([]);
  const [sermonForm, setSermonForm] = useState({ title: '', date: '', audioURL: '', videoURL: '' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    // Load Cloudinary script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      cloudinaryRef.current = window.cloudinary;
      initializeUploadWidget();
    };
    document.body.appendChild(script);

    // Fetch initial data (commented out for demo)
    // axios.get(`${process.env.REACT_APP_API_URL}/events`).then(res => setEvents(res.data));
    // axios.get(`${process.env.REACT_APP_API_URL}/sermons`).then(res => setSermons(res.data));
    
    // Mock data for demonstration
    setEvents([
      { _id: '1', title: 'Sunday Service', date: '2023-10-15', description: 'Join us for worship' },
      { _id: '2', title: 'Bible Study', date: '2023-10-18', description: 'Weekly study group' }
    ]);
    
    setSermons([
      { _id: '1', title: 'The Power of Faith', date: '2023-10-08', audioURL: '', videoURL: '' }
    ]);
  }, []);

  const initializeUploadWidget = () => {
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'drl2kb984',
        uploadPreset: 'salafcore',
        multiple: false,
        sources: ['local', 'camera', 'url'],
        showAdvancedOptions: false,
        cropping: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
              active: true
            }
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setUploading(false);
          const url = result.info.secure_url;
          const resourceType = result.info.resource_type;
          
          if (resourceType === 'image') {
            setEventForm({ ...eventForm, images: [...eventForm.images, url] });
            setMessage({ text: 'Image uploaded successfully!', type: 'success' });
          } else if (resourceType === 'video') {
            setSermonForm({ ...sermonForm, videoURL: url });
            setMessage({ text: 'Video uploaded successfully!', type: 'success' });
          } else if (resourceType === 'raw' || resourceType === 'auto') {
            setSermonForm({ ...sermonForm, audioURL: url });
            setMessage({ text: 'Audio uploaded successfully!', type: 'success' });
          }
        } else if (error) {
          setUploading(false);
          setMessage({ text: 'Upload failed. Please try again.', type: 'danger' });
        }
        
        if (result && result.event === 'close') {
          setUploading(false);
        }
        
        if (result && result.event === 'show') {
          setUploading(true);
        }
      }
    );
  };

  const openUploadWidget = (resourceType) => {
    if (widgetRef.current) {
      const options = {
        resourceType: resourceType,
        multiple: resourceType === 'image'
      };
      widgetRef.current.updateOptions(options);
      widgetRef.current.open();
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would use axios to post to your API
      // const res = await axios.post(`${process.env.REACT_APP_API_URL}/events`, eventForm);
      
      // For demo purposes, we'll just add to local state
      const newEvent = { ...eventForm, _id: Date.now().toString() };
      setEvents([...events, newEvent]);
      setEventForm({ title: '', date: '', description: '', images: [] });
      setMessage({ text: 'Event added successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error adding event. Please try again.', type: 'danger' });
    }
  };

  const handleSermonSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would use axios to post to your API
      // const res = await axios.post(`${process.env.REACT_APP_API_URL}/sermons`, sermonForm);
      
      // For demo purposes, we'll just add to local state
      const newSermon = { ...sermonForm, _id: Date.now().toString() };
      setSermons([...sermons, newSermon]);
      setSermonForm({ title: '', date: '', audioURL: '', videoURL: '' });
      setMessage({ text: 'Sermon added successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error adding sermon. Please try again.', type: 'danger' });
    }
  };

  const handleDeleteEvent = (id) => {
    // In a real app, you would use axios to delete from your API
    // axios.delete(`${process.env.REACT_APP_API_URL}/events/${id}`).then(() => {
    //   setEvents(events.filter(x => x._id !== id));
    // });
    
    // For demo purposes, we'll just update local state
    setEvents(events.filter(x => x._id !== id));
    setMessage({ text: 'Event deleted successfully!', type: 'success' });
  };

  const removeEventImage = (index) => {
    const updatedImages = [...eventForm.images];
    updatedImages.splice(index, 1);
    setEventForm({ ...eventForm, images: updatedImages });
  };

  return (
    <div className="p-4" data-aos="fade-up">
      <h2 className="mb-4">Church Admin Dashboard</h2>
      
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
          {message.text}
        </Alert>
      )}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h3 className="mb-0">Add Event</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleEventSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={eventForm.description}
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Event Images</Form.Label>
                  <div>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => openUploadWidget('image')}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </div>
                  {eventForm.images.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-1">Uploaded Images:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {eventForm.images.map((img, index) => (
                          <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                            <img 
                              src={img} 
                              alt={`Event ${index + 1}`} 
                              className="img-thumbnail h-100 w-100 object-fit-cover"
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0"
                              onClick={() => removeEventImage(index)}
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Form.Group>
                <Button type="submit" variant="primary" disabled={uploading}>
                  Add Event
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h3 className="mb-0">Add Sermon</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSermonSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={sermonForm.title}
                    onChange={e => setSermonForm({ ...sermonForm, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={sermonForm.date}
                    onChange={e => setSermonForm({ ...sermonForm, date: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Audio/Video</Form.Label>
                  <div className="mb-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => openUploadWidget('video')}
                      disabled={uploading}
                      className="me-2"
                    >
                      {uploading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => openUploadWidget('raw')}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Audio'}
                    </Button>
                  </div>
                  {sermonForm.videoURL && (
                    <div className="mt-2">
                      <p className="mb-1">Uploaded Video:</p>
                      <video controls className="w-100 rounded" style={{ maxHeight: '150px' }}>
                        <source src={sermonForm.videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  {sermonForm.audioURL && (
                    <div className="mt-2">
                      <p className="mb-1">Uploaded Audio:</p>
                      <audio controls className="w-100">
                        <source src={sermonForm.audioURL} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </Form.Group>
                <Button type="submit" variant="primary" disabled={uploading}>
                  Add Sermon
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header>
          <h3 className="mb-0">Manage Events</h3>
        </Card.Header>
        <Card.Body>
          {events.length === 0 ? (
            <p className="text-muted">No events found.</p>
          ) : (
            <Row>
              {events.map(event => (
                <Col md={6} lg={4} key={event._id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Text>
                        <small className="text-muted">Date: {new Date(event.date).toLocaleDateString()}</small>
                        <br />
                        {event.description}
                      </Card.Text>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;