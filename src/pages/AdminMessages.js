import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Spinner, Badge, Modal, Row, Col } from 'react-bootstrap';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`http://localhost:5000/api/messages?${params}`);
      
      if (response.data.success) {
        setMessages(response.data.data.messages);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/${id}/status`, { status });
      fetchMessages(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: 'danger', text: 'New' },
      read: { bg: 'info', text: 'Read' },
      replied: { bg: 'success', text: 'Replied' },
      archived: { bg: 'secondary', text: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  // Styles
  const styles = {
    adminHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px'
    },
    filters: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    },
    messageCard: {
      marginBottom: '1.5rem',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '10px'
    },
    messageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '1rem',
      borderBottom: '1px solid #e9ecef',
      backgroundColor: '#f8f9fa',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px'
    },
    messageMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    messageContent: {
      padding: '1.5rem'
    },
    messageActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderTop: '1px solid #e9ecef',
      backgroundColor: '#f8f9fa',
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '2rem'
    },
    modalContent: {
      padding: '2rem',
      borderRadius: '10px'
    },
    messageBody: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '5px',
      margin: '1rem 0'
    }
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container style={{ padding: '2rem' }}>
      <div style={styles.adminHeader}>
        <h2 style={{ color: '#2E7D32', margin: 0 }}>Message Inbox</h2>
        <div style={styles.filters}>
          <Form.Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            style={{ width: 'auto' }}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </Form.Select>
          
          <Form.Control
            type="text"
            placeholder="Search messages..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            style={{ width: 'auto' }}
          />
        </div>
      </div>

      <div>
        {messages.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <h4 style={{ color: '#6c757d' }}>No messages found</h4>
              <p>When messages are submitted, they will appear here.</p>
            </Card.Body>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message._id} style={styles.messageCard}>
              <div style={styles.messageHeader}>
                <h3 style={{ margin: 0 }}>{message.name}</h3>
                <div style={styles.messageMeta}>
                  {getStatusBadge(message.status)}
                  <span style={{ color: '#6c757d' }}>{formatDate(message.createdAt)}</span>
                </div>
              </div>
              
              <div style={styles.messageContent}>
                <Row>
                  <Col md={6}>
                    <p><strong>Email:</strong> {message.email}</p>
                  </Col>
                  {message.phone && (
                    <Col md={6}>
                      <p><strong>Phone:</strong> {message.phone}</p>
                    </Col>
                  )}
                </Row>
                {message.subject && <p><strong>Subject:</strong> {message.subject}</p>}
                <p><strong>Message:</strong> {message.message.length > 150 ? `${message.message.substring(0, 150)}...` : message.message}</p>
              </div>

              <div style={styles.messageActions}>
                <Form.Select
                  value={message.status}
                  onChange={(e) => updateStatus(message._id, e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </Form.Select>
                
                <Button 
                  variant="outline-primary"
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowModal(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <Button
            variant="outline-success"
            disabled={filters.page <= 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Previous
          </Button>
          
          <span>Page {filters.page} of {pagination.pages || 1}</span>
          
          <Button
            variant="outline-success"
            disabled={filters.page >= (pagination.pages || 1)}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#2E7D32', color: 'white' }}>
          <Modal.Title>Message Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalContent}>
          {selectedMessage && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>From:</strong> {selectedMessage.name}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                </Col>
              </Row>
              
              {selectedMessage.phone && (
                <Row className="mb-3">
                  <Col md={6}>
                    <p><strong>Phone:</strong> {selectedMessage.phone}</p>
                  </Col>
                </Row>
              )}
              
              <Row className="mb-3">
                <Col>
                  <p><strong>Subject:</strong> {selectedMessage.subject || 'No subject'}</p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col>
                  <p><strong>Message:</strong></p>
                  <div style={styles.messageBody}>{selectedMessage.message}</div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <p><strong>Received:</strong> {formatDate(selectedMessage.createdAt)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Status:</strong> {getStatusBadge(selectedMessage.status)}</p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminMessages;